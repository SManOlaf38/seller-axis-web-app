import requests
from django.conf import settings
from intuitlib.client import AuthClient
from intuitlib.enums import Scopes
from rest_framework.exceptions import ParseError

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
