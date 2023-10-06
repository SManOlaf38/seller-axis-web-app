import json

import requests
from django.conf import settings
from rest_framework.exceptions import ParseError

from selleraxis.core.utils.qbo_token import check_token_exp, create_qbo_unhandled
from selleraxis.products.models import Product
from selleraxis.qbo_unhandled_data.models import QBOUnhandledData


def save_product_qbo(
    organization, access_token, realm_id, data, action, model, object_id
):
    """Create Item in qbo.

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
    product_data = data
    url = f"{settings.QBO_QUICKBOOK_URL}/v3/company/{realm_id}/item"
    response = requests.post(url, headers=headers, data=json.dumps(product_data))
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
        return save_product_qbo(
            organization=organization,
            access_token=access_token,
            realm_id=realm_id,
            data=data,
            action=action,
            model=model,
            object_id=object_id,
        )

    product_qbo = response.json()
    return True, product_qbo


def query_product_qbo(product_to_qbo, access_token, realm_id):
    """Query Item in qbo by name.

    Args:
        product_to_qbo: Product object.
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
        f"{settings.QBO_QUICKBOOK_URL}/v3/company/{realm_id}/query?query=select * from Item "
        f"Where Name = '{product_to_qbo.sku}'"
    )
    response = requests.request("GET", url, headers=headers)
    if response.status_code == 400:
        return False, f"Error query item: {response.text}"
    if response.status_code == 401:
        return False, "expired"

    product_qbo = response.json()
    if product_qbo.get("QueryResponse") != {}:
        list_item = product_qbo.get("QueryResponse").get("Item")
        if len(list_item) > 0:
            if list_item[0].get("Name") == product_to_qbo.sku:
                product_to_qbo.qbo_product_id = int(list_item[0].get("Id"))
                product_to_qbo.sync_token = int(list_item[0].get("SyncToken"))
                product_to_qbo.save()
                return True, None
    product_to_qbo.qbo_product_id = None
    product_to_qbo.sync_token = None
    product_to_qbo.save()
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


def create_quickbook_product_service(action, model, object_id):
    product_to_qbo = Product.objects.filter(id=object_id).first()
    if product_to_qbo is None:
        raise ParseError("Product not found")
    organization = product_to_qbo.product_series.organization
    action, model = validate_action_and_model(action=action, model=model)
    access_token = validate_token(organization, action, model, object_id)
    realm_id = organization.realm_id
    check_qbo, query_message = query_product_qbo(product_to_qbo, access_token, realm_id)
    if check_qbo is True:
        result = {
            "id": product_to_qbo.id,
            "name": product_to_qbo.sku,
            "qbo_id": product_to_qbo.qbo_product_id,
            "sync_token": product_to_qbo.sync_token,
        }
        return result
    request_body = {
        "Name": product_to_qbo.sku,
        "QtyOnHand": product_to_qbo.qty_on_hand,
        "IncomeAccountRef": {"value": "81"},
        "Type": "Inventory",
    }
    creating_result, product_qbo = save_product_qbo(
        organization=organization,
        access_token=access_token,
        realm_id=realm_id,
        data=request_body,
        action=action,
        model=model,
        object_id=object_id,
    )
    qbo_id = None
    if product_qbo.get("Item"):
        qbo_id = product_qbo.get("Item").get("Id")
    if qbo_id is not None:
        product_to_qbo.qbo_product_id = int(qbo_id)
        product_to_qbo.save()
    return product_qbo


def update_quickbook_product_service(action, model, object_id):
    product_to_qbo = Product.objects.filter(id=object_id).first()
    if product_to_qbo is None:
        raise ParseError("Product not found")
    organization = product_to_qbo.product_series.organization
    action, model = validate_action_and_model(action=action, model=model)
    access_token = validate_token(organization, action, model, object_id)
    realm_id = organization.realm_id
    check_qbo = query_product_qbo(product_to_qbo, access_token, realm_id)
    if check_qbo is False:
        status = QBOUnhandledData.Status.UNHANDLED
        create_qbo_unhandled(action, model, object_id, organization, status)
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
        action=action,
        model=model,
        object_id=object_id,
    )
    sync_token = None
    if product_qbo.get("Item"):
        sync_token = product_qbo.get("Item").get("SyncToken")
    if sync_token is not None:
        product_to_qbo.sync_token = int(sync_token)
        product_to_qbo.save()
    return product_qbo
