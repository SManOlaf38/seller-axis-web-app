import json
from datetime import datetime, timezone

import requests
from django.conf import settings
from rest_framework.exceptions import ParseError

from selleraxis.products.models import Product
from selleraxis.qbo_unhandled_data.models import QBOUnhandledData


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


def get_refresh_access_token(organization):
    refresh_token = organization.qbo_refresh_token
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


def check_token_exp(organization):
    now = datetime.now(timezone.utc)
    if organization.qbo_access_token is None:
        if organization.qbo_refresh_token is not None:
            new_token_data = get_refresh_access_token(organization)
            return True, new_token_data
        return False, None
    else:
        if organization.qbo_access_token_exp_time is not None:
            if organization.qbo_access_token_exp_time >= now:
                return True, {
                    "access_token": organization.qbo_access_token,
                }
            if organization.qbo_refresh_token_exp_time >= now:
                new_token_data = get_refresh_access_token(organization)
                return True, new_token_data
            return False, None
        return False, None


def save_product_qbo(organization, access_token, realm_id, data):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json",
    }
    product_data = data
    url = f"{settings.QBO_QUICKBOOK_URL}/v3/company/{realm_id}/item"
    response = requests.post(url, headers=headers, data=json.dumps(product_data))
    if response.status_code == 400:
        return False, f"Error creating item: {response.text}"
    if response.status_code == 401:
        get_token_result, token_data = check_token_exp(organization)
        if get_token_result is False:
            return False, "Error creating item: Access token has expired!"
        access_token = token_data.get("access_token")
        return save_product_qbo(
            organization=organization,
            access_token=access_token,
            realm_id=realm_id,
            data=data,
        )

    product_qbo = response.json()
    return True, product_qbo


def query_qbo(product_to_qbo, access_token, realm_id):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json",
    }
    url = f"{settings.QBO_QUICKBOOK_URL}/v3/company/{realm_id}/query?query=select * from Item"
    response = requests.post(url, headers=headers)
    if response.status_code == 400:
        return False, f"Error creating item: {response.text}"
    if response.status_code == 401:
        return False, "Error creating item: Access token has expired!"

    product_qbo = response.json()
    list_item = product_qbo.get("QueryResponse").get("Item")
    for item in list_item:
        if (
            item.get("Name") == product_to_qbo.sku
            or item.get("Id") == product_to_qbo.qbo_product_id
        ):
            product_to_qbo.sync_token = item.get("SyncToken")
            product_to_qbo.save()
    return True


def create_quickbook_product_service(action, model, object_id):
    product_to_qbo = Product.objects.filter(id=object_id).first()
    organization = product_to_qbo.product_series.organization

    if organization.realm_id is None:
        new_qbo_unhandled = QBOUnhandledData(
            model=model,
            action=action,
            object_id=object_id,
            status=QBOUnhandledData.Status.UNHANDLED,
            organization=organization,
        )
        new_qbo_unhandled.save()
        raise ParseError("Missing realm id")

    get_token_result, token_data = check_token_exp(organization)
    if get_token_result is False:
        new_qbo_unhandled = QBOUnhandledData(
            model=model,
            action=action,
            object_id=object_id,
            status=QBOUnhandledData.Status.EXPIRED,
            organization=organization,
        )
        new_qbo_unhandled.save()
        raise ParseError("Invalid token")

    access_token = token_data.get("access_token")
    realm_id = organization.realm_id

    if product_to_qbo.qbo_product_id is not None:
        new_qbo_unhandled = QBOUnhandledData(
            model=model,
            action=action,
            object_id=object_id,
            status=QBOUnhandledData.Status.EXISTED,
            organization=organization,
        )
        new_qbo_unhandled.save()
        query_qbo(product_to_qbo, access_token, realm_id)
        raise ParseError("This product exist in qbo")

    request_body = {
        "Name": product_to_qbo.sku,
        "QtyOnHand": product_to_qbo.qty_on_hand,
        "IncomeAccountRef": {"value": "79"},
    }
    creating_result, product_qbo = save_product_qbo(
        organization=organization,
        access_token=access_token,
        realm_id=realm_id,
        data=request_body,
    )
    if creating_result is False:
        if "Access token has expired" in product_qbo:
            new_qbo_unhandled = QBOUnhandledData(
                model=model,
                action=action,
                object_id=object_id,
                status=QBOUnhandledData.Status.EXPIRED,
                organization=organization,
            )
            new_qbo_unhandled.save()
            raise ParseError("Invalid token")
        else:
            new_qbo_unhandled = QBOUnhandledData(
                model=model,
                action=action,
                object_id=object_id,
                status=QBOUnhandledData.Status.FAIL,
                organization=organization,
            )
            new_qbo_unhandled.save()
            raise ParseError(product_qbo)
    qbo_id = None
    if product_qbo.get("Item"):
        qbo_id = product_qbo.get("Item").get("Id")
    if qbo_id is not None:
        product_to_qbo.qbo_product_id = int(qbo_id)
        product_to_qbo.save()
    return product_qbo


def update_quickbook_product_service(action, model, object_id):
    product_to_qbo = Product.objects.filter(id=object_id).first()
    organization = product_to_qbo.product_series.organization

    if organization.realm_id is None:
        new_qbo_unhandled = QBOUnhandledData(
            model=model,
            action=action,
            object_id=object_id,
            status=QBOUnhandledData.Status.UNHANDLED,
            organization=organization,
        )
        new_qbo_unhandled.save()
        raise ParseError("Missing realm id")

    get_token_result, token_data = check_token_exp(organization)
    if get_token_result is False:
        new_qbo_unhandled = QBOUnhandledData(
            model=model,
            action=action,
            object_id=object_id,
            status=QBOUnhandledData.Status.EXPIRED,
            organization=organization,
        )
        new_qbo_unhandled.save()
        raise ParseError("Invalid token")

    access_token = token_data.get("access_token")
    realm_id = organization.realm_id

    if product_to_qbo.qbo_product_id is None:
        new_qbo_unhandled = QBOUnhandledData(
            model=model,
            action=action,
            object_id=object_id,
            status=QBOUnhandledData.Status.EXISTED,
            organization=organization,
        )
        new_qbo_unhandled.save()
        raise ParseError("This product not exist in qbo")

    request_body = {
        "Id": str(product_to_qbo.qbo_product_id),
        "Name": product_to_qbo.sku,
        "QtyOnHand": product_to_qbo.qty_on_hand,
        "IncomeAccountRef": {"value": "79"},
        "SyncToken": str(product_to_qbo.sync_token) if product_to_qbo.sync_token else 0,
    }

    update_result, product_qbo = save_product_qbo(
        organization=organization,
        access_token=access_token,
        realm_id=realm_id,
        data=request_body,
    )
    if update_result is False:
        if "Access token has expired" in product_qbo:
            new_qbo_unhandled = QBOUnhandledData(
                model=model,
                action=action,
                object_id=object_id,
                status=QBOUnhandledData.Status.EXPIRED,
                organization=organization,
            )
            new_qbo_unhandled.save()
            raise ParseError("Invalid token")
        else:
            new_qbo_unhandled = QBOUnhandledData(
                model=model,
                action=action,
                object_id=object_id,
                status=QBOUnhandledData.Status.FAIL,
                organization=organization,
            )
            new_qbo_unhandled.save()
            raise ParseError(product_qbo)

    sync_token = None
    if product_qbo.get("Item"):
        sync_token = product_qbo.get("Item").get("SyncToken")
    if sync_token is not None:
        product_to_qbo.sync_token = int(sync_token)
        product_to_qbo.save()
    return product_qbo
