from rest_framework.exceptions import ParseError

from selleraxis.order_item_package.models import OrderItemPackage
from selleraxis.package_rules.models import PackageRule
from selleraxis.product_alias.models import ProductAlias


def create_order_item_package_service(package, order_item, quantity):
    try:
        qty_order = order_item.qty_ordered

        list_ord_item_package = OrderItemPackage.objects.filter(
            order_item__id=order_item.id
        )
        product_alias = ProductAlias.objects.filter(merchant_sku=order_item.merchant_sku).first()
        if not product_alias:
            return {
                "status": 400,
                "message": "Not found valid product alias",
            }
        package_rule = PackageRule.objects.filter(
            product_series__id=product_alias.product.product_series.id,
            box__id=package.box.id
        ).first()
        if not package_rule:
            return {
                "status": 400,
                "message": "Not found valid max quantity for this series with this box",
            }
        check_qty_order = 0
        box_limit = package_rule.max_quantity
        for order_item_package in list_ord_item_package:
            check_qty_order += order_item_package.quantity
            if order_item.package.box.id == package.box.id:
                box_limit = box_limit - order_item.quantity * product_alias.sku_quantity
        if box_limit < quantity * product_alias.sku_quantity:
            return {
                "status": 400,
                "message": f"This box only can contain {box_limit} item this series",
            }
        remain = abs(qty_order - check_qty_order)
        if quantity <= remain and quantity != 0:
            new_order_item_package = OrderItemPackage(
                quantity=quantity,
                package_id=package.id,
                order_item_id=order_item.id,
            )
            new_order_item_package.save()
            return {"status": 200, "message": "Create success"}

        return (
            {"status": 400, "message": "Order item is max quantity"}
            if remain == 0
            else {"status": 400, "message": f"Order item only need {remain} and quantity must not 0"}
        )

    except Exception as error:
        raise error


def update_order_item_package_service(order_item_package_id, quantity):
    try:
        order_item_package = OrderItemPackage.objects.filter(
            id=order_item_package_id
        ).first()
        if not order_item_package:
            raise ParseError("Order item package id not exist!")
        order_item = order_item_package.order_item
        qty_order = order_item.qty_ordered
        if quantity <= order_item_package.quantity and quantity != 0:
            order_item_package.quantity = quantity
            order_item_package.save()
            return {"status": 200, "message": "update success"}

        list_ord_item_package = OrderItemPackage.objects.filter(
            order_item__id=order_item.id
        )
        product_alias = ProductAlias.objects.filter(merchant_sku=order_item.merchant_sku).first()
        if not product_alias:
            return {
                "status": 400,
                "message": "Not found valid product alias",
            }
        package_rule = PackageRule.objects.filter(
            product_series__id=product_alias.product.product_series.id,
            box__id=order_item_package.package.box.id
        ).first()
        if not package_rule:
            return {
                "status": 400,
                "message": "Not found valid max quantity for this series with this box",
            }
        check_qty_order = 0
        box_limit = package_rule.max_quantity
        for order_item in list_ord_item_package:
            if order_item != order_item_package:
                check_qty_order += order_item.quantity
                if order_item.package.box.id == order_item_package.package.box.id:
                    box_limit = box_limit - order_item.quantity * product_alias.sku_quantity
        if box_limit < quantity * product_alias.sku_quantity:
            return {
                "status": 400,
                "message": f"This box only can contain {box_limit} item this series",
            }
        remain = abs(qty_order - check_qty_order)
        if quantity <= remain and quantity != 0:
            order_item_package.quantity = quantity
            order_item_package.save()
            return {"status": 200, "message": "update success"}
        return (
            {"status": 400, "message": "Order item is max quantity"}
            if remain == 0
            else {"status": 400, "message": f"Order item only need {remain} and quantity must not 0"}
        )

    except Exception as error:
        raise error
