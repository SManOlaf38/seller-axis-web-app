import json
from datetime import datetime, timedelta, timezone

import requests
from django.conf import settings
from intuitlib.client import AuthClient
from intuitlib.enums import Scopes
from rest_framework.exceptions import ParseError

from selleraxis.core.clients.boto3_client import sqs_client
from selleraxis.core.utils.qbo_environment import production_and_sandbox_environments
from selleraxis.core.utils.qbo_token import check_token_exp, validate_qbo_token
from selleraxis.organizations.models import Organization
from selleraxis.products.models import Product
from selleraxis.retailer_purchase_orders.serializers import (
    ReadRetailerPurchaseOrderSerializer,
)
from selleraxis.retailers.models import Retailer
from selleraxis.retailers.services.retailer_qbo_services import query_retailer_qbo


def set_environment(organization_id):
    is_sandbox = Organization.objects.filter(id=organization_id).first().is_sandbox
    environment = "sandbox" if is_sandbox else "production"
    return AuthClient(
        settings.QBO_CLIENT_ID,
        settings.QBO_CLIENT_SECRET,
        settings.QBO_REDIRECT_URL,
        environment,
    )


def get_authorization_url(organization_id):
    auth_client = set_environment(organization_id)
    scopes = [
        Scopes.ACCOUNTING,
        Scopes.OPENID,
        Scopes.PAYMENT,
    ]
    auth_url = auth_client.get_authorization_url(scopes)
    return {"auth_url": auth_url}


def create_token(auth_code, realm_id, organization_id):
    auth_client = set_environment(organization_id)
    auth_client.get_bearer_token(auth_code, realm_id)
    organization = Organization.objects.filter(id=organization_id).first()
    current_time = datetime.now(timezone.utc)
    organization.realm_id = realm_id
    organization.qbo_refresh_token = auth_client.refresh_token
    organization.qbo_access_token = auth_client.access_token
    organization.qbo_refresh_token_exp_time = current_time + timedelta(
        seconds=auth_client.x_refresh_token_expires_in
    )
    organization.qbo_access_token_exp_time = current_time + timedelta(
        seconds=auth_client.expires_in
    )
    organization.save()
    sqs_client.create_queue(
        message_body=str(organization_id),
        queue_name=settings.SQS_QBO_SYNC_UNHANDLED_DATA_NAME,
    )
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


def create_invoice(purchase_order_serializer: ReadRetailerPurchaseOrderSerializer):
    now = datetime.now()
    line_list = []
    id_product_list = []
    for purchase_order_item in purchase_order_serializer.data["items"]:
        id_product = purchase_order_item["product_alias"]["product"]
        id_product_list.append(id_product)
    product_list = Product.objects.filter(id__in=id_product_list)

    for i, purchase_order_item in enumerate(purchase_order_serializer.data["items"]):
        qbo_product_id = find_object_with_variable(
            product_list, purchase_order_item["product_alias"]["product"]
        ).qbo_product_id
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
        retailer_to_qbo, access_token, realm_id
    )
    if check_qbo is False:
        if query_message is None:
            raise ParseError("Purchase order has retailer not sync with qbo!")
        else:
            raise ParseError(query_message)

    invoice = {
        "Line": line_invoice,
        "TxnDate": now.strftime("%Y-%d-%m"),
        "CustomerRef": {
            "value": retailer_to_qbo.qbo_customer_ref_id,
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


def save_invoices(organization, access_token, realm_id, data):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json",
    }
    invoice_data = data

    url = f"{production_and_sandbox_environments(organization)}/v3/company/{realm_id}/invoice"
    response = requests.post(url, headers=headers, data=json.dumps(invoice_data))
    if response.status_code == 400:
        raise ParseError(
            detail="Error creating invoice: {error}".format(error=response.text),
        )
    if response.status_code == 401:
        get_token_result, token_data = check_token_exp(organization)
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
        )
    invoice = response.json()
    return invoice
