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
        product_alias = ProductAlias.objects.filter(sku=order_item.vendor_sku).first()
        product_series = product_alias.product.product_series
        package_rule = PackageRule.objects.filter(
            product_series__id=product_series.id, box__id=package.box.id
        ).first()
        if quantity > package_rule.max_quantity:
            return f"Create with quantity < {package_rule.max_quantity}"
        check_qty_order = 0
        for order_item_package in list_ord_item_package:
            check_qty_order += order_item_package.quantity
        if qty_order > check_qty_order:
            if quantity < qty_order - check_qty_order:
                new_order_item_package = OrderItemPackage(
                    quantity=quantity,
                    package_id=package.id,
                    order_item_id=order_item.id,
                )
                new_order_item_package.save()
                return "Create success"
        remain = qty_order - check_qty_order
        return (
            "Order item is max quantity"
            if remain == 0
            else f"Order item only need {remain}"
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
        package = order_item_package.package
        qty_order = order_item.qty_ordered

        list_ord_item_package = OrderItemPackage.objects.filter(
            order_item__id=order_item.id
        )
        product_alias = ProductAlias.objects.filter(sku=order_item.vendor_sku).first()
        product_series = product_alias.product.product_series
        package_rule = PackageRule.objects.filter(
            product_series__id=product_series.id, box__id=package.box.id
        ).first()
        if quantity > package_rule.max_quantity:
            return f"Update with quantity < {package_rule.max_quantity}"
        check_qty_order = 0
        for order_item_package in list_ord_item_package:
            check_qty_order += order_item_package.quantity
        if qty_order > check_qty_order:
            if quantity < qty_order - check_qty_order:
                order_item_package.update(quantity=quantity)
                order_item_package.save()
                return "update success"
        remain = qty_order - check_qty_order
        return (
            "Order item is max quantity"
            if remain == 0
            else f"Order item only need {remain}"
        )

    except Exception as error:
        raise error
