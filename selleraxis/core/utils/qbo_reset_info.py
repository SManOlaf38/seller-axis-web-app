import logging

from selleraxis.invoice.models import Invoice
from selleraxis.products.models import Product
from selleraxis.retailers.models import Retailer
from selleraxis.settings.common import DATE_FORMAT, LOGGER_FORMAT

logging.basicConfig(format=LOGGER_FORMAT, datefmt=DATE_FORMAT)


def qbo_reset_infor(organization):
    """reset qbo info when change account.
    Args:
        organization: Organization object.
    Returns:
        return True if reset success, else False.
    """
    try:
        # reset invoice
        Invoice.objects.filter(
            order__batch__retailer__organization_id=organization.id
        ).update(doc_number=None, invoice_id=None)

        # reset retailer
        Retailer.objects.filter(organization_id=organization.id).update(
            qbo_customer_ref_id=None, sync_token=None
        )

        # reset prod
        Product.objects.filter(product_series__organization_id=organization.id).update(
            qbo_product_id=None, sync_token=None, inv_start_date=None
        )

        return True
    except Exception as e:
        logging.error(f"Error when reset info when change qbo account: {e}")
        raise False
