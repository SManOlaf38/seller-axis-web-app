from django.conf import settings
from intuitlib.client import AuthClient
from intuitlib.enums import Scopes

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
