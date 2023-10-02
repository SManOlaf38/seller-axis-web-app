import json

import requests
from django.conf import settings
from rest_framework.exceptions import ParseError

from selleraxis.core.utils.qbo_token import check_token_exp
from selleraxis.qbo_unhandled_data.models import QBOUnhandledData
from selleraxis.retailers.models import Retailer


def save_retailer_qbo(organization, access_token, realm_id, data):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json",
    }
    retailer_data = data
    url = f"{settings.QBO_QUICKBOOK_URL}/v3/company/{realm_id}/customer"
    response = requests.post(url, headers=headers, data=json.dumps(retailer_data))
    if response.status_code == 400:
        return False, f"Error creating customer: {response.text}"
    if response.status_code == 401:
        get_token_result, token_data = check_token_exp(organization)
        if get_token_result is False:
            return False, "Error creating customer: Access token has expired!"
        access_token = token_data.get("access_token")
        return save_retailer_qbo(
            organization=organization,
            access_token=access_token,
            realm_id=realm_id,
            data=data,
        )

    retailer_qbo = response.json()
    return True, retailer_qbo


def query_qbo(retailer_to_qbo, access_token, realm_id):
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json",
    }
    url = f"{settings.QBO_QUICKBOOK_URL}/v3/company/{realm_id}/query?query=select * from Customer"
    response = requests.post(url, headers=headers)
    if response.status_code == 400:
        return False, f"Error creating item: {response.text}"
    if response.status_code == 401:
        return False, "Error creating item: Access token has expired!"

    retailer_qbo = response.json()
    list_item = retailer_qbo.get("QueryResponse").get("Customer")
    found_qbo = False
    for item in list_item:
        if (
            item.get("DisplayName") == retailer_to_qbo.name
            or item.get("Id") == retailer_to_qbo.qbo_customer_ref_id
        ):
            found_qbo = True
            retailer_to_qbo.sync_token = item.get("SyncToken")
            retailer_to_qbo.save()
            return True
    if found_qbo is False:
        retailer_to_qbo.qbo_customer_ref_id = None
        retailer_to_qbo.sync_token = None
        retailer_to_qbo.save()
    return False


def create_quickbook_retailer_service(action, model, object_id):
    retailer_to_qbo = Retailer.objects.filter(id=object_id).first()
    if retailer_to_qbo is None:
        raise ParseError("Retailer not found")
    organization = retailer_to_qbo.organization

    if model.upper() == "PRODUCT":
        model = QBOUnhandledData.Model.PRODUCT
    elif model.upper() == "RETAILER":
        model = QBOUnhandledData.Model.RETAILER
    else:
        raise ParseError("Model invalid")

    if action.upper() == "CREATE":
        action = QBOUnhandledData.Action.CREATE
    elif action.upper() == "UPDATE":
        action = QBOUnhandledData.Action.UPDATE
    else:
        raise ParseError("Action invalid")

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

    if retailer_to_qbo.qbo_customer_ref_id is not None:
        new_qbo_unhandled = QBOUnhandledData(
            model=model,
            action=action,
            object_id=object_id,
            status=QBOUnhandledData.Status.EXISTED,
            organization=organization,
        )
        new_qbo_unhandled.save()
        check_qbo = query_qbo(retailer_to_qbo, access_token, realm_id)
        if check_qbo is True:
            raise ParseError("This retailer exist in qbo")

    request_body = {
        "DisplayName": retailer_to_qbo.name,
    }
    creating_result, retailer_qbo = save_retailer_qbo(
        organization=organization,
        access_token=access_token,
        realm_id=realm_id,
        data=request_body,
    )
    if creating_result is False:
        if "Access token has expired" in retailer_qbo:
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
            raise ParseError(retailer_qbo)
    qbo_id = None
    if retailer_qbo.get("Customer"):
        qbo_id = retailer_qbo.get("Customer").get("Id")
    if qbo_id is not None:
        retailer_to_qbo.qbo_customer_ref_id = int(qbo_id)
        retailer_to_qbo.save()
    return retailer_qbo


def update_quickbook_retailer_service(action, model, object_id):
    retailer_to_qbo = Retailer.objects.filter(id=object_id).first()
    if retailer_to_qbo is None:
        raise ParseError("Retailer not found")
    organization = retailer_to_qbo.organization

    if model.upper() == "PRODUCT":
        model = QBOUnhandledData.Model.PRODUCT
    elif model.upper() == "RETAILER":
        model = QBOUnhandledData.Model.RETAILER
    else:
        raise ParseError("Model invalid")

    if action.upper() == "CREATE":
        action = QBOUnhandledData.Action.CREATE
    elif action.upper() == "UPDATE":
        action = QBOUnhandledData.Action.UPDATE
    else:
        raise ParseError("Action invalid")

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

    if retailer_to_qbo.qbo_customer_ref_id is None:
        new_qbo_unhandled = QBOUnhandledData(
            model=model,
            action=action,
            object_id=object_id,
            status=QBOUnhandledData.Status.EXISTED,
            organization=organization,
        )
        new_qbo_unhandled.save()
        raise ParseError("This retailer not exist in qbo")

    request_body = {
        "Id": str(retailer_to_qbo.qbo_customer_ref_id),
        "Name": retailer_to_qbo.name,
        "SyncToken": str(retailer_to_qbo.sync_token)
        if retailer_to_qbo.sync_token
        else 0,
    }

    update_result, retailer_qbo = save_retailer_qbo(
        organization=organization,
        access_token=access_token,
        realm_id=realm_id,
        data=request_body,
    )
    if update_result is False:
        if "Access token has expired" in retailer_qbo:
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
            raise ParseError(retailer_qbo)

    sync_token = None
    if retailer_qbo.get("Customer"):
        sync_token = retailer_qbo.get("Customer").get("SyncToken")
    if sync_token is not None:
        retailer_to_qbo.sync_token = int(sync_token)
        retailer_to_qbo.save()
    return retailer_qbo
