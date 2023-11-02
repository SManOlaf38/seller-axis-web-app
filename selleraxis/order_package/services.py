from rest_framework.exceptions import ParseError

from selleraxis.boxes.models import Box
from selleraxis.order_item_package.models import OrderItemPackage
from selleraxis.order_package.models import OrderPackage
from selleraxis.package_rules.models import PackageRule
from selleraxis.product_alias.models import ProductAlias
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem


def create_order_package_service(box_id, order_item_id, quantity, is_check=None):
    try:
        order_item = RetailerPurchaseOrderItem.objects.filter(id=order_item_id).first()
        if not order_item:
            return {
                "status": 400,
                "message": f"Order item id {order_item_id} not exist",
            }

        box = Box.objects.filter(id=box_id).first()
        if not box:
            return {
                "status": 400,
                "message": f"Box id {box_id} not exist",
            }
        qty_order = order_item.qty_ordered

        list_ord_item_package = OrderItemPackage.objects.filter(
            order_item__id=order_item.id
        )
        list_product_alias = ProductAlias.objects.filter(
            merchant_sku=order_item.merchant_sku,
            retailer_id=order_item.order.batch.retailer_id,
        )
        if len(list_product_alias) > 1:
            raise ParseError("Some product alias duplicate merchant_sku")
        if len(list_product_alias) == 0:
            return {
                "status": 400,
                "message": "Not found valid product alias",
            }
        product_alias = list_product_alias[0]
        package_rule = PackageRule.objects.filter(
            product_series__id=product_alias.product.product_series.id, box__id=box.id
        ).first()
        if not package_rule:
            return {
                "status": 400,
                "message": "Not found valid max quantity for this series with this box",
            }
        if quantity * product_alias.sku_quantity > package_rule.max_quantity:
            return {
                "status": 400,
                "message": f"This box only can contain {package_rule.max_quantity} item this series",
            }
        check_qty_order = 0
        for order_item_package in list_ord_item_package:
            check_qty_order += order_item_package.quantity
        remain = abs(qty_order - check_qty_order)
        if quantity <= remain and quantity != 0:
            if is_check is None or is_check == "false":
                new_order_package = OrderPackage(
                    box_id=box.id,
                    order_id=order_item.order.id,
                    length=box.length,
                    width=box.width,
                    height=box.height,
                    dimension_unit=box.dimension_unit,
                    weight=product_alias.product.weight * quantity,
                    weight_unit=product_alias.product.weight_unit,
                )
                new_order_package.save()
                new_order_item_package = OrderItemPackage(
                    quantity=quantity,
                    package_id=new_order_package.id,
                    order_item_id=order_item.id,
                )
                new_order_item_package.save()
                message_data = {
                    "object_id": new_order_package.id,
                }
                return {"status": 200, "message": message_data}
            elif is_check == "true":
                return {"status": 200, "message": "Package is valid to creating!"}

        return (
            {"status": 400, "message": "Order item is max quantity"}
            if remain == 0
            else {
                "status": 400,
                "message": f"Order item only need {remain} and quantity must not 0",
            }
        )

    except Exception as error:
        raise error


def delete_order_package_service(order_id_package: int):
    try:
        order_package = OrderPackage.objects.filter(id=order_id_package).first()
        if not order_package:
            raise ParseError("Order package id not exist!")
        shipment_packages = order_package.shipment_packages.all()
        if shipment_packages is not None:
            raise ParseError("This order package status is shipped can be deleted")
        order_package.delete()

        return "delete success"

    except Exception as error:
        raise error
