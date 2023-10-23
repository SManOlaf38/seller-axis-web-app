from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from selleraxis.product_alias.models import ProductAlias
from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder


class RetailerPurchaseOrderItem(models.Model):
    retailer_purchase_order_item_id = models.CharField(max_length=255)
    order_line_number = models.CharField(max_length=255)
    merchant_line_number = models.CharField(max_length=255)
    qty_ordered = models.IntegerField()
    unit_of_measure = models.CharField(max_length=255)
    upc = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    description_2 = models.CharField(max_length=255)
    merchant_sku = models.CharField(max_length=255)
    vendor_sku = models.CharField(max_length=255)
    unit_cost = models.FloatField(max_length=255)
    shipping_code = models.CharField(max_length=255)
    expected_ship_date = models.CharField(max_length=255)
    po_line_data = models.JSONField(null=True)
    order = models.ForeignKey(
        RetailerPurchaseOrder, related_name="items", on_delete=models.CASCADE
    )
    cancel_reason = models.CharField(null=True, max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class PendingInventorySubtraction(models.Model):
    order_item = models.ForeignKey(RetailerPurchaseOrderItem, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


@receiver(post_save, sender=RetailerPurchaseOrderItem)
def create_purchase_order_item(sender, instance, **kwargs):
    if kwargs.get("created", False):
        qty_order = int(instance.qty_ordered)
        product_alias = ProductAlias.objects.filter(
            merchant_sku=instance.merchant_sku,
            retailer_id=instance.order.batch.retailer_id,
        ).last()
        pending_inventory_subtraction = []
        if product_alias:
            sku_quantity = int(product_alias.sku_quantity)
            product = product_alias.product
            qty_on_hand = product.qty_on_hand
            qty_pending = product.qty_pending
            update_qty_on_hand = qty_on_hand - (qty_order * sku_quantity)
            update_qty_pending = qty_pending + (qty_order * sku_quantity)
            product.qty_on_hand = update_qty_on_hand
            product.qty_pending = update_qty_pending
            product.save(update_fields=["qty_on_hand", "qty_pending"])
        else:
            pending_inventory_subtraction.append(
                PendingInventorySubtraction(order_item=instance)
            )
        PendingInventorySubtraction.objects.bulk_create(pending_inventory_subtraction)
