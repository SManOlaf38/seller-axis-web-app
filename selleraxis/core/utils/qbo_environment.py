from django.conf import settings


def production_and_sandbox_environments(organization):
    qbo_quickbook_url = settings.QBO_QUICKBOOK_URL
    if not organization.is_sandbox:
        qbo_quickbook_url = settings.PROD_QBO_QUICKBOOK_URL
    return qbo_quickbook_url
