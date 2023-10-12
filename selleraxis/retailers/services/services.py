import json

import requests
from django.conf import settings
from rest_framework.exceptions import ParseError

from selleraxis.core.utils.qbo_token import check_token_exp, create_qbo_unhandled
from selleraxis.qbo_unhandled_data.models import QBOUnhandledData
from selleraxis.retailers.models import Retailer


def save_retailer_qbo(
    organization, access_token, realm_id, data, action, model, object_id
):
    """Create Customer in qbo.

    Args:
        action: An string.
        model: An string.
        object_id: An integer.
        data: A dict.
        access_token: An string.
        organization: Organization object.
        realm_id: An string.
    Returns:
        return status saving process, data return.
    Raises:
        ParseError: Error when saving
        ParseError: Invalid token (both access token and refresh token expired)
    """
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json",
    }
    retailer_data = data
    url = f"{settings.QBO_QUICKBOOK_URL}/v3/company/{realm_id}/customer"
    response = requests.post(url, headers=headers, data=json.dumps(retailer_data))
    if response.status_code == 400:
        status = QBOUnhandledData.Status.FAIL
        create_qbo_unhandled(action, model, object_id, organization, status)
        raise ParseError(response.text)
    if response.status_code == 401:
        get_token_result, token_data = check_token_exp(organization)
        if get_token_result is False:
            status = QBOUnhandledData.Status.EXPIRED
            create_qbo_unhandled(action, model, object_id, organization, status)

            organization.qbo_access_token = None
            organization.qbo_refresh_token = None
            organization.qbo_access_token_exp_time = None
            organization.qbo_refresh_token_exp_time = None
            organization.save()

            raise ParseError("Invalid token")
        access_token = token_data.get("access_token")
        return save_retailer_qbo(
            organization=organization,
            access_token=access_token,
            realm_id=realm_id,
            data=data,
            action=action,
            model=model,
            object_id=object_id,
        )

    retailer_qbo = response.json()
    return True, retailer_qbo


def query_retailer_qbo(retailer_to_qbo, access_token, realm_id):
    """Query Customer in qbo by DisplayName.

    Args:
        retailer_to_qbo: Retailer object.
        access_token: An string.
        realm_id: An string.
    Returns:
        return status saving process, data return.
    Raises:
        None
    """
    headers = {
        "Content-Type": "text/plain",
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json",
    }
    url = (
        f"{settings.QBO_QUICKBOOK_URL}/v3/company/{realm_id}/query?query=select * from Customer "
        f"Where DisplayName = '{retailer_to_qbo.name}'"
    )
    response = requests.request("GET", url, headers=headers)
    if response.status_code == 400:
        return False, f"Error query customer: {response.text}"
    if response.status_code == 401:
        return False, "expired"

    retailer_qbo = response.json()
    if retailer_qbo.get("QueryResponse") != {}:
        list_item = retailer_qbo.get("QueryResponse").get("Customer")
        if len(list_item) > 0:
            if list_item[0].get("DisplayName") == retailer_to_qbo.name:
                retailer_to_qbo.qbo_customer_ref_id = int(list_item[0].get("Id"))
                retailer_to_qbo.sync_token = int(list_item[0].get("SyncToken"))
                retailer_to_qbo.save()
                return True, None
    retailer_to_qbo.qbo_customer_ref_id = None
    retailer_to_qbo.sync_token = None
    retailer_to_qbo.save()
    return False, None


def validate_token(organization, action, model, object_id):
    """Validate qbo token.

    Args:
        organization: Organization object.
        action: An string.
        model: An string.
        object_id: An integer.
    Returns:
        return status saving process, data return.
    Raises:
        ParseError: Missing realm id
        ParseError: Invalid token (both access token and refresh token expired)
    """
    if organization.realm_id is None:
        status = QBOUnhandledData.Status.UNHANDLED
        create_qbo_unhandled(action, model, object_id, organization, status)
        raise ParseError("Missing realm id")

    get_token_result, token_data = check_token_exp(organization)
    if get_token_result is False:
        status = QBOUnhandledData.Status.EXPIRED
        create_qbo_unhandled(action, model, object_id, organization, status)

        organization.qbo_access_token = None
        organization.qbo_refresh_token = None
        organization.qbo_access_token_exp_time = None
        organization.qbo_refresh_token_exp_time = None
        organization.save()

        raise ParseError("Invalid token")

    access_token = token_data.get("access_token")
    return access_token


def validate_action_and_model(action, model):
    """Validate qbo token.

    Args:
        action: An string.
        model: An string.
    Returns:
        return action, model.
    Raises:
        ParseError: Model invalid
        ParseError: Action invalid
    """
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

    return action, model


def create_quickbook_retailer_service(action, model, object_id):
    retailer_to_qbo = Retailer.objects.filter(id=object_id).first()
    if retailer_to_qbo is None:
        raise ParseError("Retailer not found")
    organization = retailer_to_qbo.organization
    action, model = validate_action_and_model(action=action, model=model)
    access_token = validate_token(organization, action, model, object_id)
    realm_id = organization.realm_id
    check_qbo, query_message = query_retailer_qbo(
        retailer_to_qbo, access_token, realm_id
    )
    if check_qbo is True:
        result = {
            "id": retailer_to_qbo.id,
            "name": retailer_to_qbo.name,
            "qbo_id": retailer_to_qbo.qbo_customer_ref_id,
            "sync_token": retailer_to_qbo.sync_token,
        }
        return result

    request_body = {
        "DisplayName": retailer_to_qbo.name,
    }
    creating_result, retailer_qbo = save_retailer_qbo(
        organization=organization,
        access_token=access_token,
        realm_id=realm_id,
        data=request_body,
        action=action,
        model=model,
        object_id=object_id,
    )
    qbo_id = None
    qbo_synctoken = None
    if retailer_qbo.get("Customer"):
        qbo_id = retailer_qbo.get("Customer").get("Id")
        qbo_synctoken = retailer_qbo.get("Customer").get("SyncToken")
    if qbo_id is not None:
        retailer_to_qbo.qbo_customer_ref_id = int(qbo_id)
        retailer_to_qbo.save()
    if qbo_synctoken is not None:
        retailer_to_qbo.sync_token = int(qbo_synctoken)
        retailer_to_qbo.save()
    return retailer_qbo


def update_quickbook_retailer_service(action, model, object_id):
    retailer_to_qbo = Retailer.objects.filter(id=object_id).first()
    if retailer_to_qbo is None:
        raise ParseError("Retailer not found")
    organization = retailer_to_qbo.organization
    action, model = validate_action_and_model(action=action, model=model)
    access_token = validate_token(organization, action, model, object_id)
    realm_id = organization.realm_id
    check_qbo, query_message = query_retailer_qbo(
        retailer_to_qbo, access_token, realm_id
    )
    if check_qbo is False:
        status = QBOUnhandledData.Status.UNHANDLED
        create_qbo_unhandled(action, model, object_id, organization, status)
        raise ParseError("This retailer not exist in qbo")

    request_body = {
        "Id": str(retailer_to_qbo.qbo_customer_ref_id),
        "DisplayName": retailer_to_qbo.name,
        "SyncToken": str(retailer_to_qbo.sync_token)
        if retailer_to_qbo.sync_token
        else 0,
    }

    update_result, retailer_qbo = save_retailer_qbo(
        organization=organization,
        access_token=access_token,
        realm_id=realm_id,
        data=request_body,
        action=action,
        model=model,
        object_id=object_id,
    )
    sync_token = None
    if retailer_qbo.get("Customer"):
        sync_token = retailer_qbo.get("Customer").get("SyncToken")
    if sync_token is not None:
        retailer_to_qbo.sync_token = int(sync_token)
        retailer_to_qbo.save()
    return retailer_qbo
