import json
from datetime import datetime

import requests
from django.conf import settings
from intuitlib.client import AuthClient
from intuitlib.enums import Scopes
from rest_framework.exceptions import ParseError

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


def create_invoice(purchase_order_serializer: ReadRetailerPurchaseOrderSerializer):
    now = datetime.now()
    line_list = []
    for purchase_order_item in purchase_order_serializer.data["items"]:
        amount = purchase_order_item["qty_ordered"] * purchase_order_item["unit_cost"]
        line = {
            "DetailType": "SalesItemLineDetail",
            "Amount": amount,
            "SalesItemLineDetail": {
                "Qty": purchase_order_item["qty_ordered"],
                "UnitPrice": purchase_order_item["unit_cost"],
                "ItemRef": {
                    "name": purchase_order_item["product_alias"]["vendor_sku"],
                    "value": "1",
                },
            },
            "LineNum": purchase_order_item["order_line_number"],
        }
        line_list.append(line)
    if not purchase_order_serializer.data["po_number"]:
        raise ParseError("Purchase order has no value of po number!")

    invoice = {
        "Line": line_list,
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
