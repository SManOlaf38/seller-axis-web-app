from django.db import models

from selleraxis.retailer_order_batchs.models import RetailerOrderBatch
from selleraxis.retailer_participating_parties.models import RetailerParticipatingParty
from selleraxis.retailer_person_places.models import RetailerPersonPlace


class RetailerPurchaseOrder(models.Model):
    retailer_purchase_order_id = models.CharField(max_length=255)
    transaction_id = models.CharField(max_length=255)
    participating_party = models.ForeignKey(
        RetailerParticipatingParty, on_delete=models.CASCADE
    )
    senders_id_for_receiver = models.CharField(max_length=255)
    po_number = models.CharField(max_length=255)
    order_date = models.DateTimeField(auto_now=True)
    ship_to = models.ForeignKey(
        RetailerPersonPlace, related_name="ship_to_orders", on_delete=models.CASCADE
    )
    bill_to = models.ForeignKey(
        RetailerPersonPlace, related_name="bill_to_orders", on_delete=models.CASCADE
    )
    invoice_to = models.ForeignKey(
        RetailerPersonPlace, related_name="invoice_to_orders", on_delete=models.CASCADE
    )
    customer = models.ForeignKey(
        RetailerPersonPlace, related_name="customer_orders", on_delete=models.CASCADE
    )
    shipping_code = models.CharField(max_length=255)
    sales_division = models.CharField(max_length=255)
    vendor_warehouse_id = models.CharField(max_length=255)
    cust_order_number = models.CharField(max_length=255)
    po_hdr_data = models.JSONField()
    control_number = models.CharField(max_length=255)
    buying_contract = models.CharField(max_length=255)
    batch = models.ForeignKey(RetailerOrderBatch, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
