import json
import logging
from datetime import datetime, timedelta, timezone

import requests
from django.conf import settings
from intuitlib.client import AuthClient
from intuitlib.enums import Scopes
from rest_framework.exceptions import ParseError

from selleraxis.core.clients.boto3_client import sqs_client
from selleraxis.core.utils.qbo_environment import production_and_sandbox_environments
from selleraxis.core.utils.qbo_reset_info import qbo_reset_infor
from selleraxis.core.utils.qbo_token import check_token_exp, validate_qbo_token
from selleraxis.order_item_package.models import OrderItemPackage
from selleraxis.organizations.models import Organization
from selleraxis.products.models import Product
from selleraxis.retailer_purchase_orders.serializers import (
    ReadRetailerPurchaseOrderSerializer,
)
from selleraxis.retailers.models import Retailer
from selleraxis.retailers.services.retailer_qbo_services import query_retailer_qbo
from selleraxis.settings.common import DATE_FORMAT, LOGGER_FORMAT

logging.basicConfig(format=LOGGER_FORMAT, datefmt=DATE_FORMAT)


def get_user_info_qbo(organization, access_token, is_exp, max_try=0):
    """Get user info qbo.

    Args:
        access_token: An string.
        organization: Organization object.
        is_exp: A bool.
        max_try: An Integer.
    Returns:
        return status saving process, data return.
    Raises:
        ParseError: Error when get user info
        ParseError: Invalid token (both access token and refresh token expired)
    """
    if max_try < 2:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json",
        }
        is_sandbox = organization.is_sandbox
        api_host = "https://accounts.platform.intuit.com"
        if is_sandbox:
            api_host = "https://sandbox-accounts.platform.intuit.com"
        url = f"{api_host}/v1/openid_connect/userinfo"
        response = requests.get(url, headers=headers)

        if response.status_code == 401:
            logging.error(response.text)
            raise ParseError(response.text)
        if response.status_code == 403:
            logging.error("Token invalid for environment")
            raise ParseError("Token invalid for environment")
        if response.status_code == 401:
            if not is_exp:
                get_token_result, token_data = check_token_exp(organization, is_sandbox)
                if get_token_result is False:
                    organization.qbo_access_token = None
                    organization.qbo_refresh_token = None
                    organization.qbo_access_token_exp_time = None
                    organization.qbo_refresh_token_exp_time = None
                    organization.save()

                    raise ParseError("Invalid token")
                access_token = token_data.get("access_token")
                max_try = max_try + 1
                return get_user_info_qbo(
                    organization=organization,
                    access_token=access_token,
                    is_exp=True,
                    max_try=max_try,
                )
            else:
                logging.error("This account is not registered to this environment")
                raise ParseError("This account is not registered to this environment")
        user_info = response.json()
        return True, user_info
    return False, None


def set_environment(organization):
    is_sandbox = not organization.sandbox_organization
    environment = "sandbox" if is_sandbox else "production"
    return (
        AuthClient(
            settings.QBO_CLIENT_ID,
            settings.QBO_CLIENT_SECRET,
            settings.QBO_REDIRECT_URL,
            environment,
        )
        if is_sandbox
        else AuthClient(
            settings.PROD_QBO_CLIENT_ID,
            settings.PROD_QBO_CLIENT_SECRET,
            settings.QBO_REDIRECT_URL,
            environment,
        )
    )


def get_authorization_url(organization):
    is_sandbox = False if organization.sandbox_organization else True
    auth_client = set_environment(organization)
    scopes = (
        [
            Scopes.ACCOUNTING,
            Scopes.OPENID,
        ]
        if is_sandbox
        else [
            Scopes.ACCOUNTING,
            Scopes.OPENID,
        ]
    )
    auth_url = auth_client.get_authorization_url(scopes)
    return {"auth_url": auth_url}


def create_token(auth_code, realm_id, organization_id, register):
    organization = Organization.objects.filter(id=organization_id).first()
    if organization is None:
        raise ParseError("Organization is not exist!")
    auth_client = set_environment(organization)
    try:
        auth_client.get_bearer_token(auth_code, realm_id)
    except Exception as e:
        error_data = e.content.decode("utf-8")
        if error_data is not None:
            error_data = json.loads(error_data)
            error_message = error_data.get("error_description")
            raise ParseError(f"{error_message}, re-login QBO and try again!")
        else:
            raise ParseError("Error when get bearer token: ", e)
    current_time = datetime.now(timezone.utc)
    current_realm_id = organization.realm_id
    current_user_uuid = organization.qbo_user_uuid
    environment = "production" if organization.sandbox_organization else "sandbox"

    get_info_result, new_user_info = get_user_info_qbo(
        organization=organization,
        access_token=auth_client.access_token,
        is_exp=False,
    )
    if not get_info_result:
        raise ParseError("Fail to connect to QBO, re-login QBO and try again!")
    #
    if not register:
        if current_realm_id is not None:
            if current_user_uuid is not None:
                if new_user_info.get("sub") != current_user_uuid:
                    raise ParseError(
                        f"You are using a account different from QBO account registered for {environment} environment!"
                    )

    organization.realm_id = realm_id
    organization.qbo_refresh_token = auth_client.refresh_token
    organization.qbo_access_token = auth_client.access_token
    organization.qbo_refresh_token_exp_time = current_time + timedelta(
        seconds=auth_client.x_refresh_token_expires_in
    )
    organization.qbo_access_token_exp_time = current_time + timedelta(
        seconds=auth_client.expires_in
    )
    organization.qbo_user_uuid = new_user_info.get("sub")
    organization.save()
    sqs_client.create_queue(
        message_body=str(organization_id),
        queue_name=settings.SQS_QBO_SYNC_UNHANDLED_DATA_NAME,
    )
    qbo_reset_infor(organization=organization)
    return {
        "access_token": auth_client.access_token,
        "refresh_token": auth_client.refresh_token,
    }


def find_object_with_variable(array_of_objects: list[Product], id_object):
    for object in array_of_objects:
        if object.id == id_object:
            return object
    return None


def check_line_list(data):
    merged_data = {}

    for item in data:
        item_ref = item["SalesItemLineDetail"]["ItemRef"]
        item_name = item_ref["name"]
        item_value = item_ref["value"]
        amount = item["Amount"]
        quantity = item["SalesItemLineDetail"]["Qty"]

        if item_name in merged_data:
            merged_data[item_name]["Amount"] += amount
            merged_data[item_name]["Quantity"] += quantity
            merged_data[item_name]["Value"] = item_value
        else:
            merged_data[item_name] = {
                "Amount": amount,
                "Quantity": quantity,
                "Value": item_value,
            }

    merged_array = []

    for item_name, values in merged_data.items():
        merged_array.append(
            {
                "DetailType": "SalesItemLineDetail",
                "Amount": values["Amount"],
                "SalesItemLineDetail": {
                    "Qty": values["Quantity"],
                    "UnitPrice": values["Amount"] / values["Quantity"],
                    "ItemRef": {"name": item_name, "value": values["Value"]},
                },
            }
        )
    return merged_array


def create_invoice(
    purchase_order_serializer: ReadRetailerPurchaseOrderSerializer, is_sandbox: bool
):
    line_list = []
    id_product_list = []
    shipped_items = []
    order_packages = []
    list_order_item = purchase_order_serializer.data["items"]
    list_order_item_package = OrderItemPackage.objects.filter(
        package__order__id=purchase_order_serializer.data["id"]
    )
    for order_item in list_order_item:
        check_qty = 0
        for order_item_package in list_order_item_package:
            if order_item.get("id") == order_item_package.order_item.id:
                check_qty += order_item_package.quantity
        if check_qty != order_item.get("qty_ordered"):
            raise ParseError("Only fulfillment shipped order can invoice")

    for order_package in purchase_order_serializer.data["order_packages"]:
        if len(order_package.get("shipment_packages", [])) > 0:
            order_packages.append(order_package)

    for order_package in order_packages:
        package_id = order_package["id"]
        order_item_packages = order_package["order_item_packages"]
        for order_item_package in order_item_packages:
            item = order_item_package["retailer_purchase_order_item"]
            item["package"] = package_id
            shipped_items.append(item)

    for order_item in shipped_items:
        new_qty = 0
        for order_package in order_packages:
            for order_item_package in order_package.get("order_item_packages"):
                order_item_id = order_item_package.get(
                    "retailer_purchase_order_item"
                ).get("id")
                if order_item.get("id") == order_item_id:
                    new_qty += order_item_package.get("quantity")
        order_item["qty_ordered"] = new_qty

    for purchase_order_item in purchase_order_serializer.data["items"]:
        if purchase_order_item.get("product_alias") is None:
            raise ParseError("Some item don't have product alias!")
        id_product = purchase_order_item["product_alias"]["product"]
        if id_product is not None:
            id_product_list.append(id_product)
    product_list = Product.objects.filter(id__in=id_product_list)

    purchase_order_serializer.data["items"] = shipped_items

    for i, purchase_order_item in enumerate(purchase_order_serializer.data["items"]):
        product_valid = find_object_with_variable(
            product_list, purchase_order_item["product_alias"]["product"]
        )
        qbo_product_id = product_valid.qbo_product_id
        if not qbo_product_id:
            qbo_product_id = 1
        qty_product = int(purchase_order_item["product_alias"]["sku_quantity"]) * int(
            purchase_order_item["qty_ordered"]
        )
        amount = purchase_order_item["qty_ordered"] * purchase_order_item["unit_cost"]
        line = {
            "DetailType": "SalesItemLineDetail",
            "Amount": amount,
            "SalesItemLineDetail": {
                "Qty": qty_product,
                "UnitPrice": amount / qty_product,
                "ItemRef": {
                    "name": find_object_with_variable(
                        product_list, purchase_order_item["product_alias"]["product"]
                    ).sku,
                    "value": str(qbo_product_id),
                },
            },
        }
        line_list.append(line)
    line_invoice = check_line_list(line_list)
    if not purchase_order_serializer.data["po_number"]:
        raise ParseError("Purchase order has no value of po number!")

    retailer_id = purchase_order_serializer.data["batch"]["retailer"]["id"]
    retailer_to_qbo = Retailer.objects.filter(id=retailer_id).first()
    organization = retailer_to_qbo.organization
    access_token = validate_qbo_token(organization)
    realm_id = organization.realm_id
    check_qbo, query_message = query_retailer_qbo(
        retailer_to_qbo, access_token, realm_id, organization.is_sandbox
    )
    if check_qbo is False:
        if query_message is None:
            raise ParseError("Purchase order has retailer not sync with qbo!")
        else:
            raise ParseError(query_message)

    inv_start_date = None
    if purchase_order_serializer.data.get("inv_start_date") is not None:
        inv_start_date = purchase_order_serializer.data.get("inv_start_date")
    convert_date = (
        inv_start_date.strftime("%Y-%m-%d")
        if inv_start_date
        else datetime.now().strftime("%Y-%m-%d")
    )

    qbo_customer_ref_id = retailer_to_qbo.qbo_customer_ref_id
    invoice = {
        "Line": line_invoice,
        "TxnDate": convert_date,
        "CustomerRef": {
            "value": qbo_customer_ref_id,
        },
        "CustomField": [
            {
                "DefinitionId": "1",
                "StringValue": purchase_order_serializer.data["po_number"],
                "Type": "StringType",
                "Name": "Field One",
            }
        ],
    }
    return invoice


def save_invoices(organization, access_token, realm_id, data, is_sandbox):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json",
    }
    invoice_data = data

    url = f"{production_and_sandbox_environments(is_sandbox)}/v3/company/{realm_id}/invoice"
    response = requests.post(url, headers=headers, data=json.dumps(invoice_data))
    if response.status_code == 400:
        raise ParseError(
            detail="Error creating invoice: {error}".format(error=response.text),
        )
    if response.status_code == 401:
        get_token_result, token_data = check_token_exp(organization, is_sandbox)
        if get_token_result is False:
            raise ParseError(
                detail="Access token has expired!",
            )
        access_token = token_data.get("access_token")
        return save_invoices(
            organization=organization,
            access_token=access_token,
            realm_id=realm_id,
            data=data,
            is_sandbox=is_sandbox,
        )
    invoice = response.json()
    return invoice
