from django.conf import settings


def production_and_sandbox_environments(is_sandbox):
    qbo_quickbook_url = settings.QBO_QUICKBOOK_URL
    if is_sandbox is False:
        qbo_quickbook_url = settings.PROD_QBO_QUICKBOOK_URL
    return qbo_quickbook_url
