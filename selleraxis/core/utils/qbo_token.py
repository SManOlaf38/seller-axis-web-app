from datetime import datetime, timezone

import requests
from django.conf import settings
from rest_framework.exceptions import ParseError


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
