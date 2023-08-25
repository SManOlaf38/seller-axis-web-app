import json
from datetime import datetime

import requests
from django.conf import settings
from intuitlib.client import AuthClient
from intuitlib.enums import Scopes
from rest_framework.exceptions import ParseError

from selleraxis.products.models import Product
from selleraxis.retailer_purchase_orders.serializers import (
    ReadRetailerPurchaseOrderSerializer,
)

auth_client = AuthClient(
    settings.QBO_CLIENT_ID,
    settings.QBO_CLIENT_SECRET,
    settings.QBO_REDIRECT_URL,
    settings.QBO_ENVIRONMENT,
)


def get_authorization_url():
    scopes = [
        Scopes.ACCOUNTING,
    ]
    auth_url = auth_client.get_authorization_url(scopes)
    return {"auth_url": auth_url}


def create_token(auth_code, realm_id):
    auth_client.get_bearer_token(auth_code, realm_id)
    return {
        "access_token": auth_client.access_token,
        "refresh_token": auth_client.refresh_token,
    }


def refresh_access_token(refresh_token, client_id, client_secret, redirect_uri):
    payload = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
    }

    try:
        response = requests.post(settings.QBO_TOKEN_ENDPOINT, data=payload)
        response.raise_for_status()  # Raise an exception for non-2xx responses

        token_data = response.json()
        access_token = token_data["access_token"]
        new_refresh_token = token_data["refresh_token"]

        # Store the new access token and refresh token for future use
        # You can save them in a file, database, or any other storage mechanism

        return access_token, new_refresh_token
    except requests.exceptions.RequestException as e:
        ParseError(detail="Error refreshing access token: {error}".format(error=e))
        return None, None


def get_refresh_access_token(refresh_token):
    new_access_token, new_refresh_token = refresh_access_token(
        refresh_token,
        settings.QBO_CLIENT_ID,
        settings.QBO_CLIENT_SECRET,
        settings.QBO_REDIRECT_URL,
    )
    if new_access_token and new_refresh_token:
        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
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

    invoice = {
        "Line": line_invoice,
        "TxnDate": now.strftime("%Y-%d-%m"),
        "CustomerRef": {
            "value": purchase_order_serializer.data["batch"]["retailer"][
                "qbo_customer_ref_id"
            ],
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


def save_invoices(access_token, realm_id, data):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json",
    }
    invoice_data = data
    url = f"{settings.QBO_QUICKBOOK_URL}/v3/company/{realm_id}/invoice"
    response = requests.post(url, headers=headers, data=json.dumps(invoice_data))
    if response.status_code == 400:
        raise ParseError(
            detail="Error creating invoice: {error}".format(error=response.text),
        )
    if response.status_code == 401:
        raise ParseError(
            detail="Access token has expired!",
        )
    invoice = response.json()
    return invoice
