from rest_framework.exceptions import ParseError

from selleraxis.order_item_package.models import OrderItemPackage
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
        check_qty_order = 0
        for order_item_package in list_ord_item_package:
            check_qty_order += order_item_package.quantity
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
            else {"status": 400, "message": f"Order item only need {remain}"}
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
        if quantity <= order_item_package.quantity:
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
        check_qty_order = 0
        for order_item in list_ord_item_package:
            if order_item != order_item_package:
                check_qty_order += order_item.quantity
        remain = abs(qty_order - check_qty_order)
        if quantity <= remain:
            order_item_package.quantity = quantity
            order_item_package.save()
            return {"status": 200, "message": "update success"}
        return (
            {"status": 400, "message": "Order item is max quantity"}
            if remain == 0
            else {"status": 400, "message": f"Order item only need {remain}"}
        )

    except Exception as error:
        raise error
