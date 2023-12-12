import base64
from datetime import datetime, timezone

import requests
from django.conf import settings
from rest_framework.exceptions import ParseError

from selleraxis.qbo_unhandled_data.models import QBOUnhandledData


def create_qbo_unhandled(action, model, object_id, organization, status, is_sandbox):
    """Create object QBOUnhandledData.

    Args:
        action: An string.
        model: An string.
        object_id: An integer.
        organization: Organization object.
        status: An string.
        is_sandbox: A boolean
    Returns:
        None return.
    Raises:
        None
    """
    new_qbo_unhandled = QBOUnhandledData(
        model=model,
        action=action,
        object_id=object_id,
        status=status,
        organization=organization,
        is_sandbox=is_sandbox,
    )
    new_qbo_unhandled.save()


def refresh_access_token(refresh_token, client_id, client_secret, redirect_uri):
    origin_string = client_id + ":" + client_secret
    to_binary = origin_string.encode("ascii")
    basic_auth = (base64.b64encode(to_binary)).decode("ascii")
    auth_token = "Basic " + basic_auth
    payload = f"grant_type=refresh_token&refresh_token={refresh_token}"
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": auth_token,
    }

    try:
        response = requests.request(
            "POST", settings.QBO_TOKEN_ENDPOINT, headers=headers, data=payload
        )
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


def get_refresh_access_token(organization, is_sandbox):
    refresh_token = organization.qbo_refresh_token
    client_id = settings.QBO_CLIENT_ID
    client_secret = settings.QBO_CLIENT_SECRET
    client_redirect_url = settings.QBO_REDIRECT_URL
    if not is_sandbox:
        client_id = settings.PROD_QBO_CLIENT_ID
        client_secret = settings.PROD_QBO_CLIENT_SECRET
    new_access_token, new_refresh_token = refresh_access_token(
        refresh_token,
        client_id,
        client_secret,
        client_redirect_url,
    )
    if new_access_token and new_refresh_token:
        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
        }


def check_token_exp(organization, is_sandbox):
    now = datetime.now(timezone.utc)
    qbo_access_token = organization.qbo_access_token
    qbo_refresh_token = organization.qbo_refresh_token
    qbo_access_token_exp_time = organization.qbo_access_token_exp_time
    qbo_refresh_token_exp_time = organization.qbo_refresh_token_exp_time

    if qbo_access_token is None:
        if qbo_refresh_token is not None:
            new_token_data = get_refresh_access_token(organization, is_sandbox)
            return True, new_token_data
        return False, None
    else:
        if qbo_access_token_exp_time is not None:
            if qbo_access_token_exp_time >= now:
                return True, {
                    "access_token": qbo_access_token,
                }
            if qbo_refresh_token_exp_time >= now:
                new_token_data = get_refresh_access_token(organization, is_sandbox)
                if new_token_data is None:
                    return False, None
                return True, new_token_data
            return False, None
        return False, None


def validate_qbo_token(organization):
    """Validate qbo token.

    Args:
        organization: Organization object.
    Returns:
        return access_token: str.
    Raises:
        ParseError: Please organization realm id
        ParseError: Please loging QBO again for refresh token (both access token and refresh token expired)
    """
    is_sandbox = organization.is_sandbox
    realm_id = organization.realm_id
    if realm_id is None:
        raise ParseError("Please check organization realm id")

    get_token_result, token_data = check_token_exp(organization, is_sandbox)
    if get_token_result is False:
        organization.qbo_access_token = None
        organization.qbo_refresh_token = None
        organization.qbo_access_token_exp_time = None
        organization.qbo_refresh_token_exp_time = None
        organization.save()

        raise ParseError("Please loging QBO again for refresh token")

    access_token = token_data.get("access_token")
    return access_token
