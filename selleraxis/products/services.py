import asyncio
import base64
import json
import logging
import re
import uuid
from datetime import datetime

import boto3
import requests
from asgiref.sync import async_to_sync, sync_to_async
from django.conf import settings
from django.core.exceptions import ValidationError
from django.forms import URLField
from rest_framework.exceptions import ParseError

from selleraxis.core.utils.qbo_environment import production_and_sandbox_environments
from selleraxis.core.utils.qbo_token import check_token_exp, create_qbo_unhandled
from selleraxis.qbo_unhandled_data.models import QBOUnhandledData
from selleraxis.settings.common import DATE_FORMAT, LOGGER_FORMAT

logging.basicConfig(format=LOGGER_FORMAT, datefmt=DATE_FORMAT)


def save_product_qbo(
    organization, access_token, realm_id, data, action, model, object_id, is_sandbox
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
        is_sandbox: A boolean.
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

    url = (
        f"{production_and_sandbox_environments(is_sandbox)}/v3/company/{realm_id}/item"
    )
    response = requests.post(url, headers=headers, data=json.dumps(product_data))
    if response.status_code == 400:
        status = QBOUnhandledData.Status.FAIL
        sync_to_async(create_qbo_unhandled)(
            action, model, object_id, organization, status, is_sandbox
        )
        json_response = json.loads(response.text)
        response_fault = json_response.get("Fault")
        if response_fault and response_fault.get("Error"):
            if (
                isinstance(response_fault.get("Error"), list)
                and len(response_fault.get("Error")) == 1
            ):
                if response_fault.get("Error")[0].get("code") == "6240":
                    raise ParseError(response_fault.get("Error")[0].get("Detail"))
        logging.error(response.text)
        raise ParseError(response.text)
    if response.status_code == 401:
        get_token_result, token_data = check_token_exp(organization, is_sandbox)
        if get_token_result is False:
            status = QBOUnhandledData.Status.EXPIRED
            sync_to_async(create_qbo_unhandled)(
                action, model, object_id, organization, status, is_sandbox
            )

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
            is_sandbox=is_sandbox,
        )

    product_qbo = response.json()
    return True, product_qbo


def save_account_ref_qbo(
    organization, access_token, realm_id, data, action, model, object_id, is_sandbox
):
    """Create account ref in qbo.

    Args:
        action: An string.
        model: An string.
        object_id: An integer.
        data: A dict.
        access_token: An string.
        organization: Organization object.
        realm_id: An string.
        is_sandbox: A boolean.
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
    account_ref_data = data

    url = f"{production_and_sandbox_environments(is_sandbox)}/v3/company/{realm_id}/account"
    response = requests.post(url, headers=headers, data=json.dumps(account_ref_data))
    if response.status_code == 400:
        status = QBOUnhandledData.Status.FAIL
        sync_to_async(create_qbo_unhandled)(
            action, model, object_id, organization, status, is_sandbox
        )
        json_response = json.loads(response.text)
        response_fault = json_response.get("Fault")
        if response_fault and response_fault.get("Error"):
            if (
                isinstance(response_fault.get("Error"), list)
                and len(response_fault.get("Error")) == 1
            ):
                if response_fault.get("Error")[0].get("code") == "6240":
                    return False, response_fault.get("Error")[0].get("Detail")
        logging.error(response.text)
        return False, response.text
    if response.status_code == 401:
        get_token_result, token_data = check_token_exp(organization, is_sandbox)
        if get_token_result is False:
            status = QBOUnhandledData.Status.EXPIRED
            sync_to_async(create_qbo_unhandled)(
                action, model, object_id, organization, status, is_sandbox
            )

            organization.qbo_access_token = None
            organization.qbo_refresh_token = None
            organization.qbo_access_token_exp_time = None
            organization.qbo_refresh_token_exp_time = None
            organization.save()

            return False, "Invalid token"
        access_token = token_data.get("access_token")
        return save_account_ref_qbo(
            organization=organization,
            access_token=access_token,
            realm_id=realm_id,
            data=data,
            action=action,
            model=model,
            object_id=object_id,
            is_sandbox=is_sandbox,
        )

    account_ref_qbo = response.json()
    return True, account_ref_qbo


def query_product_qbo(
    action,
    model,
    object_id,
    organization,
    product_to_qbo,
    access_token,
    realm_id,
    is_sandbox,
):
    """Query Item in qbo by name.

    Args:
        organization: Organization object.
        action: An string.
        model: An string.
        object_id: An integer.
        product_to_qbo: Product object.
        access_token: An string.
        realm_id: An string.
        is_sandbox: A boolean.
    Returns:
        return status saving process, data return.
    Raises:
        None
    """
    try:
        headers = {
            "Content-Type": "text/plain",
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json",
        }
        url = (
            f"{production_and_sandbox_environments(is_sandbox)}/v3/company/{realm_id}/query?query=select * from Item "
            f"Where Name = '{product_to_qbo.sku}'"
        )
        response = requests.request("GET", url, headers=headers)
        if response.status_code == 400:
            return False, f"Error query item: {response.text}"
        if response.status_code == 401:
            return False, "expired"
        if response.status_code != 200:
            return False, f"Error query item: {response.text}"

        product_qbo = response.json()
        if (
            product_qbo.get("QueryResponse") != {}
            and product_qbo.get("QueryResponse") is not None
        ):
            list_item = product_qbo.get("QueryResponse").get("Item")
            if list_item is not None:
                if len(list_item) > 0:
                    if list_item[0].get("Name") == product_to_qbo.sku:
                        product_to_qbo.qbo_product_id = int(list_item[0].get("Id"))
                        product_to_qbo.sync_token = int(list_item[0].get("SyncToken"))
                        if list_item[0].get("InvStartDate", None) is not None:
                            date_response = list_item[0].get("InvStartDate")
                            element = datetime.strptime(date_response, "%Y-%m-%d")
                            product_to_qbo.inv_start_date = element
                        product_to_qbo.save()
                        return True, None
            else:
                return False, f"Error query item: {response.text}"
        product_to_qbo.qbo_product_id = None
        product_to_qbo.sync_token = None
        product_to_qbo.inv_start_date = None
        product_to_qbo.save()
        return False, None
    except Exception as e:
        status = QBOUnhandledData.Status.FAIL
        sync_to_async(create_qbo_unhandled)(
            action, model, object_id, organization, status, is_sandbox
        )
        raise ParseError(f"Error query item: {e}")


def query_account_ref_qbo(
    action,
    model,
    object_id,
    organization,
    product_to_qbo,
    access_token,
    realm_id,
    is_sandbox,
):
    """Query Item in qbo by name.

    Args:
        organization: Organization object.
        action: An string.
        model: An string.
        object_id: An integer.
        product_to_qbo: Product object.
        access_token: An string.
        realm_id: An string.
        is_sandbox: A boolean.
    Returns:
        return status saving process, data return.
    Raises:
        None
    """
    try:
        headers = {
            "Content-Type": "text/plain",
            "Authorization": f"Bearer {access_token}",
            "Accept": "application/json",
        }
        list_account_name = []
        url = (
            f"{production_and_sandbox_environments(is_sandbox)}/v3/company/{realm_id}/query?"
            f"query=select * from Account "
            f"Where Name IN ('{product_to_qbo.qbo_account_ref_name}', "
            f"'{product_to_qbo.income_account_ref_name}', "
            f"'{product_to_qbo.expense_account_ref_name}')"
        )
        response = requests.request("GET", url, headers=headers)
        if response.status_code == 400:
            return False, f"Error query account ref: {response.text}"
        if response.status_code == 401:
            return False, "expired"
        if response.status_code != 200:
            return False, f"Error query account ref: {response.text}"

        product_qbo = response.json()
        if (
            product_qbo.get("QueryResponse") != {}
            and product_qbo.get("QueryResponse") is not None
        ):
            list_item = product_qbo.get("QueryResponse").get("Account")
            if list_item is not None:
                if len(list_item) > 0:
                    # remove account exist qbo from list account need create
                    for account_item in list_item:
                        if (
                            account_item.get("Name").upper()
                            == product_to_qbo.qbo_account_ref_name.upper()
                        ):
                            product_to_qbo.qbo_account_ref_id = int(
                                account_item.get("Id")
                            )
                            product_to_qbo.qbo_account_ref_name = account_item.get(
                                "Name"
                            )
                            list_account_name.append(
                                product_to_qbo.qbo_account_ref_name
                            )
                        elif (
                            account_item.get("Name").upper()
                            == product_to_qbo.income_account_ref_name.upper()
                        ):
                            product_to_qbo.income_account_ref_id = int(
                                account_item.get("Id")
                            )
                            product_to_qbo.income_account_ref_name = account_item.get(
                                "Name"
                            )
                            list_account_name.append(
                                product_to_qbo.income_account_ref_name
                            )
                        elif (
                            account_item.get("Name").upper()
                            == product_to_qbo.expense_account_ref_name.upper()
                        ):
                            product_to_qbo.expense_account_ref_id = int(
                                account_item.get("Id")
                            )
                            product_to_qbo.expense_account_ref_name = account_item.get(
                                "Name"
                            )
                            list_account_name.append(
                                product_to_qbo.expense_account_ref_name
                            )
                        product_to_qbo.save()
                    return True, list_account_name
            else:
                return False, f"Error query account ref: {response.text}"
        product_to_qbo.qbo_account_ref_id = None
        product_to_qbo.expense_account_ref_id = None
        product_to_qbo.income_account_ref_id = None
        product_to_qbo.save()
        return False, None
    except Exception as e:
        status = QBOUnhandledData.Status.FAIL
        sync_to_async(create_qbo_unhandled)(
            action, model, object_id, organization, status, is_sandbox
        )
        raise ParseError(f"Error query account ref: {e}")


def validate_token(organization, action, model, object_id, is_sandbox):
    """Validate qbo token.

    Args:
        organization: Organization object.
        action: An string.
        model: An string.
        object_id: An integer.
        is_sandbox: An boolean.
    Returns:
        return status saving process, data return.
    Raises:
        ParseError: Missing realm id
        ParseError: Invalid token (both access token and refresh token expired)
    """
    realm_id = organization.realm_id

    if realm_id is None:
        status = QBOUnhandledData.Status.UNHANDLED
        sync_to_async(create_qbo_unhandled)(
            action, model, object_id, organization, status, is_sandbox
        )
        raise ParseError("Missing realm id")

    get_token_result, token_data = check_token_exp(organization, is_sandbox)
    if get_token_result is False:
        status = QBOUnhandledData.Status.EXPIRED
        sync_to_async(create_qbo_unhandled)(
            action, model, object_id, organization, status, is_sandbox
        )

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


@sync_to_async
def create_list_account(
    account_name,
    product_to_qbo,
    organization,
    access_token,
    realm_id,
    action,
    model,
    is_sandbox,
):
    """Validate qbo token.

    Args:
        account_name: A string.
        product_to_qbo: Product object.
        organization: Organization object.
        access_token: A string.
        realm_id: A string.
        action: A string.
        model: A string.
        is_sandbox: An boolean.
    Returns:
        return status saving process, data return.
    Raises:
        ParseError: Missing realm id
        ParseError: Invalid token (both access token and refresh token expired)
    """
    account_ref_name = product_to_qbo.qbo_account_ref_name
    income_account_ref_name = product_to_qbo.qbo_account_ref_name
    expense_account_ref_name = product_to_qbo.qbo_account_ref_name
    account_type = "Other Current Asset"
    if account_name == income_account_ref_name:
        account_type = "Income"
    elif account_name == expense_account_ref_name:
        account_type = "Cost of Goods Sold"

    create_account_body = {
        "Name": account_name,
        "AccountType": account_type,
    }
    creating_account_result, account_ref_qbo = save_account_ref_qbo(
        organization=organization,
        access_token=access_token,
        realm_id=realm_id,
        data=create_account_body,
        action=action,
        model=model,
        object_id=product_to_qbo.id,
        is_sandbox=is_sandbox,
    )
    if isinstance(account_ref_qbo, dict) and account_ref_qbo.get("Account"):
        if account_name == income_account_ref_name:
            product_to_qbo.income_account_ref_id = account_ref_qbo.get("Account").get(
                "Id"
            )
        elif account_name == expense_account_ref_name:
            product_to_qbo.expense_account_ref_id = account_ref_qbo.get("Account").get(
                "Id"
            )
        elif account_name == account_ref_name:
            product_to_qbo.qbo_account_ref_id = account_ref_qbo.get("Account").get("Id")
        product_to_qbo.save()

        return {
            "account_name": account_name,
            "account_id": account_ref_qbo.get("Account").get("Id"),
        }
    return None


@async_to_sync
async def create_quickbook_product_service(
    action, model, product_to_qbo, is_sandbox, organization
):
    """Create qbo product(item).

    Args:
        action: An string.
        model: An string.
        product_to_qbo: Product object.
        is_sandbox: A bool.
        organization: Organization object.
    Returns:
        return product id, name and qbo info.
    Raises:
        ParseError: Message create qbo fail.
    """
    action, model = validate_action_and_model(action=action, model=model)
    access_token = validate_token(
        organization, action, model, product_to_qbo.id, is_sandbox
    )
    realm_id = organization.realm_id
    check_qbo, query_message = query_product_qbo(
        action=action,
        model=model,
        object_id=product_to_qbo.id,
        organization=organization,
        product_to_qbo=product_to_qbo,
        access_token=access_token,
        realm_id=realm_id,
        is_sandbox=is_sandbox,
    )
    if check_qbo is True:
        qbo_id = product_to_qbo.qbo_product_id
        sync_token = product_to_qbo.sync_token
        inv_start_date = product_to_qbo.inv_start_date
        convert_date = (
            inv_start_date.strftime("%Y-%m-%d")
            if inv_start_date
            else datetime.now().strftime("%Y-%m-%d")
        )
        result = {
            "id": product_to_qbo.id,
            "name": product_to_qbo.sku,
            "qbo_id": qbo_id,
            "sync_token": sync_token,
            "inv_start_date": convert_date,
        }
        return result
    inv_start_date = product_to_qbo.inv_start_date
    convert_date = (
        inv_start_date.strftime("%Y-%m-%d")
        if inv_start_date
        else datetime.now().strftime("%Y-%m-%d")
    )
    account_ref_name = product_to_qbo.qbo_account_ref_name
    account_ref_id = None
    income_account_ref_name = product_to_qbo.qbo_account_ref_name
    income_account_ref_id = None
    expense_account_ref_name = product_to_qbo.qbo_account_ref_name
    expense_account_ref_id = None
    list_account_name = [
        account_ref_name,
        income_account_ref_name,
        expense_account_ref_name,
    ]
    # check account ref is exist or not in qbo
    check_account, found_account_list = query_account_ref_qbo(
        action=action,
        model=model,
        object_id=product_to_qbo.id,
        organization=organization,
        product_to_qbo=product_to_qbo,
        access_token=access_token,
        realm_id=realm_id,
        is_sandbox=is_sandbox,
    )
    # if check status false, both 3 type account seem to be not exist, create all
    if check_account is False:
        # for account_name in list_account_name:
        list_account_info = await asyncio.gather(
            *[
                create_list_account(
                    account_name=account_name,
                    product_to_qbo=product_to_qbo,
                    organization=organization,
                    access_token=access_token,
                    realm_id=realm_id,
                    action=action,
                    model=model,
                    is_sandbox=is_sandbox,
                )
                for account_name in list_account_name
            ]
        )
        for account_info in list_account_info:
            if isinstance(account_info, dict):
                if account_info.get("account_name") == income_account_ref_name:
                    income_account_ref_id = account_info.get("account_id")
                elif account_info.get("account_name") == expense_account_ref_name:
                    expense_account_ref_id = account_info.get("account_id")
                elif account_info.get("account_name") == account_ref_name:
                    account_ref_id = account_info.get("account_id")

    else:
        # if check status is true, we check list account is missing, and create
        if isinstance(found_account_list, list) and len(found_account_list) != len(
            list_account_name
        ):
            handle_account_list = []
            for account_name in list_account_name:
                if account_name not in found_account_list:
                    handle_account_list.append(account_name)
            list_account_info = await asyncio.gather(
                *[
                    create_list_account(
                        account_name=account_name,
                        product_to_qbo=product_to_qbo,
                        organization=organization,
                        access_token=access_token,
                        realm_id=realm_id,
                        action=action,
                        model=model,
                        is_sandbox=is_sandbox,
                    )
                    for account_name in handle_account_list
                ]
            )
            for account_info in list_account_info:
                if isinstance(account_info, dict):
                    if account_info.get("account_name") == income_account_ref_name:
                        income_account_ref_id = account_info.get("account_id")
                    elif account_info.get("account_name") == expense_account_ref_name:
                        expense_account_ref_id = account_info.get("account_id")
                    elif account_info.get("account_name") == account_ref_name:
                        account_ref_id = account_info.get("account_id")
    # update db with account ids we found
    if account_ref_id is not None:
        product_to_qbo.qbo_account_ref_id = account_ref_id
        product_to_qbo.save()
    if income_account_ref_id is not None:
        product_to_qbo.income_account_ref_id = income_account_ref_id
        product_to_qbo.save()
    if expense_account_ref_id is not None:
        product_to_qbo.expense_account_ref_id = expense_account_ref_id
        product_to_qbo.save()
    request_body = {
        "TrackQtyOnHand": True,
        "Name": product_to_qbo.sku,
        "QtyOnHand": product_to_qbo.qty_on_hand,
        "IncomeAccountRef": {
            "name": product_to_qbo.income_account_ref_name,
            "value": str(product_to_qbo.income_account_ref_id),
        },
        "AssetAccountRef": {
            "name": product_to_qbo.qbo_account_ref_name,
            "value": str(product_to_qbo.qbo_account_ref_id),
        },
        "InvStartDate": convert_date,
        "Type": "Inventory",
        "ExpenseAccountRef": {
            "name": product_to_qbo.expense_account_ref_name,
            "value": str(product_to_qbo.expense_account_ref_id),
        },
    }
    creating_result, product_qbo = save_product_qbo(
        organization=organization,
        access_token=access_token,
        realm_id=realm_id,
        data=request_body,
        action=action,
        model=model,
        object_id=product_to_qbo.id,
        is_sandbox=is_sandbox,
    )
    qbo_id = None
    qbo_synctoken = None
    qbo_inv_start_date = None

    return_response = {
        "id": product_to_qbo.id,
        "name": product_to_qbo.sku,
    }

    if product_qbo.get("Item"):
        qbo_id = product_qbo.get("Item").get("Id")
        qbo_synctoken = product_qbo.get("Item").get("SyncToken")
        qbo_inv_start_date = product_qbo.get("Item").get("InvStartDate")
    if qbo_id is not None:
        return_response["qbo_id"] = int(qbo_id)
        product_to_qbo.qbo_product_id = int(qbo_id)
        product_to_qbo.save()
    if qbo_synctoken is not None:
        return_response["sync_token"] = int(qbo_synctoken)
        product_to_qbo.sync_token = int(qbo_synctoken)
        product_to_qbo.save()
    if qbo_inv_start_date is not None:
        element = datetime.strptime(qbo_inv_start_date, "%Y-%m-%d")
        return_response["inv_start_date"] = element
        product_to_qbo.inv_start_date = element
        product_to_qbo.save()

    return return_response


@async_to_sync
async def update_quickbook_product_service(
    action, model, product_to_qbo, is_sandbox, organization
):
    """Update qbo product(item).

    Args:
        action: An string.
        model: An string.
        product_to_qbo: Product object.
        is_sandbox: A bool.
        organization: Organization object.
    Returns:
        return product id, name and qbo info.
    Raises:
        ParseError: Message update qbo fail.
    """
    action, model = validate_action_and_model(action=action, model=model)
    access_token = sync_to_async(validate_token)(
        organization, action, model, product_to_qbo.id, is_sandbox
    )
    realm_id = organization.realm_id

    account_ref_name = product_to_qbo.qbo_account_ref_name
    account_ref_id = None
    income_account_ref_name = product_to_qbo.qbo_account_ref_name
    income_account_ref_id = None
    expense_account_ref_name = product_to_qbo.qbo_account_ref_name
    expense_account_ref_id = None
    list_account_name = [
        account_ref_name,
        income_account_ref_name,
        expense_account_ref_name,
    ]
    # check account ref is exist or not in qbo
    check_account, found_account_list = query_account_ref_qbo(
        action=action,
        model=model,
        object_id=product_to_qbo.id,
        organization=organization,
        product_to_qbo=product_to_qbo,
        access_token=access_token,
        realm_id=realm_id,
        is_sandbox=is_sandbox,
    )
    # if check status false, both 3 type account seem to be not exist, create all
    if check_account is False:
        list_account_info = await asyncio.gather(
            *[
                create_list_account(
                    account_name=account_name,
                    product_to_qbo=product_to_qbo,
                    organization=organization,
                    access_token=access_token,
                    realm_id=realm_id,
                    action=action,
                    model=model,
                    is_sandbox=is_sandbox,
                )
                for account_name in list_account_name
            ]
        )
        for account_info in list_account_info:
            if isinstance(account_info, dict):
                if account_info.get("account_name") == income_account_ref_name:
                    income_account_ref_id = account_info.get("account_id")
                elif account_info.get("account_name") == expense_account_ref_name:
                    expense_account_ref_id = account_info.get("account_id")
                elif account_info.get("account_name") == account_ref_name:
                    account_ref_id = account_info.get("account_id")
    else:
        # if check status is true, we check list account is missing, and create
        if isinstance(found_account_list, list) and len(found_account_list) != len(
            list_account_name
        ):
            handle_account_list = []
            for account_name in list_account_name:
                if account_name not in found_account_list:
                    handle_account_list.append(account_name)
            list_account_info = await asyncio.gather(
                *[
                    create_list_account(
                        account_name=account_name,
                        product_to_qbo=product_to_qbo,
                        organization=organization,
                        access_token=access_token,
                        realm_id=realm_id,
                        action=action,
                        model=model,
                        is_sandbox=is_sandbox,
                    )
                    for account_name in handle_account_list
                ]
            )
            for account_info in list_account_info:
                if isinstance(account_info, dict):
                    if account_info.get("account_name") == income_account_ref_name:
                        income_account_ref_id = account_info.get("account_id")
                    elif account_info.get("account_name") == expense_account_ref_name:
                        expense_account_ref_id = account_info.get("account_id")
                    elif account_info.get("account_name") == account_ref_name:
                        account_ref_id = account_info.get("account_id")
    # update db with account ids we found
    if account_ref_id is not None:
        product_to_qbo.qbo_account_ref_id = account_ref_id
        product_to_qbo.save()
    if income_account_ref_id is not None:
        product_to_qbo.income_account_ref_id = income_account_ref_id
        product_to_qbo.save()
    if expense_account_ref_id is not None:
        product_to_qbo.expense_account_ref_id = expense_account_ref_id
        product_to_qbo.save()
    check_qbo, query_message = query_product_qbo(
        action=action,
        model=model,
        object_id=product_to_qbo.id,
        organization=organization,
        product_to_qbo=product_to_qbo,
        access_token=access_token,
        realm_id=realm_id,
        is_sandbox=is_sandbox,
    )
    if check_qbo is False:
        if query_message is None:
            # create new obj qbo when not exist
            inv_start_date = product_to_qbo.inv_start_date
            convert_date = (
                inv_start_date.strftime("%Y-%m-%d")
                if inv_start_date
                else datetime.now().strftime("%Y-%m-%d")
            )
            request_body = {
                "TrackQtyOnHand": True,
                "Name": product_to_qbo.sku,
                "QtyOnHand": product_to_qbo.qty_on_hand,
                "IncomeAccountRef": {
                    "name": product_to_qbo.income_account_ref_name,
                    "value": str(product_to_qbo.income_account_ref_id),
                },
                "AssetAccountRef": {
                    "name": product_to_qbo.qbo_account_ref_name,
                    "value": str(product_to_qbo.qbo_account_ref_id),
                },
                "InvStartDate": convert_date,
                "Type": "Inventory",
                "ExpenseAccountRef": {
                    "name": product_to_qbo.expense_account_ref_name,
                    "value": str(product_to_qbo.expense_account_ref_id),
                },
            }
            creating_result, product_qbo = save_product_qbo(
                organization=organization,
                access_token=access_token,
                realm_id=realm_id,
                data=request_body,
                action=action,
                model=model,
                object_id=product_to_qbo.id,
                is_sandbox=is_sandbox,
            )
            qbo_id = None
            qbo_synctoken = None
            qbo_inv_start_date = None
            if product_qbo.get("Item"):
                qbo_id = product_qbo.get("Item").get("Id")
                qbo_synctoken = product_qbo.get("Item").get("SyncToken")
                qbo_inv_start_date = product_qbo.get("Item").get("InvStartDate")
            if qbo_id is not None:
                product_to_qbo.qbo_product_id = int(qbo_id)
                product_to_qbo.save()
            if qbo_synctoken is not None:
                product_to_qbo.sync_token = int(qbo_synctoken)
                product_to_qbo.save()
            if qbo_inv_start_date is not None:
                element = datetime.strptime(qbo_inv_start_date, "%Y-%m-%d")
                product_to_qbo.inv_start_date = element
                product_to_qbo.save()
            return product_qbo
        # If toke expired when query
        elif query_message == "expired":
            status = QBOUnhandledData.Status.EXPIRED
            sync_to_async(create_qbo_unhandled)(
                action, model, product_to_qbo.id, organization, status, is_sandbox
            )
            raise ParseError(query_message)
        # If cant not query
        else:
            status = QBOUnhandledData.Status.FAIL
            sync_to_async(create_qbo_unhandled)(
                action, model, product_to_qbo.id, organization, status, is_sandbox
            )
            raise ParseError(query_message)
    qbo_product_id = product_to_qbo.qbo_product_id
    sync_token = product_to_qbo.sync_token
    inv_start_date = product_to_qbo.inv_start_date
    if qbo_product_id is None:
        status = QBOUnhandledData.Status.FAIL
        sync_to_async(create_qbo_unhandled)(
            action, model, product_to_qbo.id, organization, status, is_sandbox
        )
        raise ParseError(query_message)
    convert_date = (
        inv_start_date.strftime("%Y-%m-%d")
        if inv_start_date
        else datetime.now().strftime("%Y-%m-%d")
    )
    request_body = {
        "TrackQtyOnHand": True,
        "Id": str(qbo_product_id),
        "Name": product_to_qbo.sku,
        "QtyOnHand": product_to_qbo.qty_on_hand,
        "IncomeAccountRef": {
            "name": product_to_qbo.income_account_ref_name,
            "value": str(product_to_qbo.income_account_ref_id),
        },
        "AssetAccountRef": {
            "name": product_to_qbo.qbo_account_ref_name,
            "value": str(product_to_qbo.qbo_account_ref_id),
        },
        "InvStartDate": convert_date,
        "Type": "Inventory",
        "ExpenseAccountRef": {
            "name": product_to_qbo.expense_account_ref_name,
            "value": str(product_to_qbo.expense_account_ref_id),
        },
        "SyncToken": str(sync_token) if sync_token else 0,
    }
    update_result, product_qbo = save_product_qbo(
        organization=organization,
        access_token=access_token,
        realm_id=realm_id,
        data=request_body,
        action=action,
        model=model,
        object_id=product_to_qbo.id,
        is_sandbox=is_sandbox,
    )
    sync_token = None
    qbo_inv_start_date = None
    if product_qbo.get("Item"):
        sync_token = product_qbo.get("Item").get("SyncToken")
        qbo_inv_start_date = product_qbo.get("Item").get("InvStartDate")
    if sync_token is not None:
        product_to_qbo.sync_token = int(sync_token)
    if qbo_inv_start_date is not None:
        element = datetime.strptime(qbo_inv_start_date, "%Y-%m-%d")
        product_to_qbo.inv_start_date = element
    product_to_qbo.save()
    return product_qbo


def is_s3_url(url):
    """
    Checks if a URL is an S3 URL.
    Args:
        url: The URL to check.
    Returns:
        True if the URL is an S3 URL, False otherwise.
    """
    # Check if the URL starts with "s3://" or "https://s3.amazonaws.com/".
    if re.match(r"^(s3://|https://s3\.amazonaws\.com/)", url):
        return True
    # Check if the URL contains an S3 bucket name.
    if re.search(r"\.s3\.amazonaws\.com/", url):
        return True
    # Otherwise, the URL is not an S3 URL.
    return False


def url_put_image_s3(url):
    """
    Put image in S3
    Args:
        url: the url of image
    Returns:
        returns S3 link
    """
    key = str(uuid.uuid4())
    r = requests.get(url, stream=True)
    session = boto3.Session()
    s3 = session.resource("s3")
    bucket = s3.Bucket(settings.BUCKET_NAME)
    bucket.upload_fileobj(r.raw, key)
    response = f"https://{settings.BUCKET_NAME}.s3.amazonaws.com/{key}"
    return response


def base64_put_image_s3(image_base64):
    base64_data = re.sub(r"^data:image/[^;]+;base64,", "", image_base64)
    key = str(uuid.uuid4())
    imgdata = base64.b64decode(base64_data)
    s3 = boto3.client("s3")
    s3.put_object(
        Bucket=settings.BUCKET_NAME,
        Key=key,
        Body=imgdata,
        ContentType="image/jpeg",
    )
    response = f"https://{settings.BUCKET_NAME}.s3.amazonaws.com/{key}"
    return response


def is_valid_url(url):
    url_form_field = URLField()
    try:
        url = url_form_field.clean(url)
    except ValidationError:
        return False
    return True


def is_base64(string):
    try:
        base64.b64decode(string)
        return True
    except Exception:
        return False
