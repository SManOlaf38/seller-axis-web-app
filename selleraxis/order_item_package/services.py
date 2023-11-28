from rest_framework.exceptions import ParseError

from selleraxis.core.utils.convert_weight_by_unit import convert_weight
from selleraxis.order_item_package.models import OrderItemPackage
from selleraxis.package_rules.models import PackageRule
from selleraxis.product_alias.models import ProductAlias


def create_order_item_package_service(package, order_item, quantity):
    try:
        qty_order = order_item.qty_ordered

        list_ord_item_package = OrderItemPackage.objects.filter(
            order_item__id=order_item.id
        )
        list_product_alias = ProductAlias.objects.filter(
            merchant_sku=order_item.merchant_sku,
            retailer__id=order_item.order.batch.retailer.id,
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
            product_series__id=product_alias.product.product_series.id,
            box__id=package.box.id,
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
            if order_item_package.package.box.id == package.box.id:
                box_limit = (
                    box_limit - order_item_package.quantity * product_alias.sku_quantity
                )
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
            # re-calculating weight of box
            add_weight = (
                new_order_item_package.quantity
                * product_alias.product.weight
                * product_alias.sku_quantity
            )
            item_weight_unit = product_alias.product.weight_unit.upper()
            if item_weight_unit not in ["LB", "LBS"]:
                add_weight = convert_weight(
                    weight_value=add_weight, weight_unit=item_weight_unit
                )
            old_package_weight = convert_weight(
                weight_value=package.weight, weight_unit=package.weight_unit.upper()
            )
            package.weight_unit = "lbs"
            package.weight = old_package_weight + add_weight
            package.save()
            # data return
            message_data = {
                "id": new_order_item_package.id,
                "package": new_order_item_package.package.id,
                "order_item": new_order_item_package.order_item.id,
                "quantity": new_order_item_package.quantity,
            }
            return {"status": 200, "message": message_data}

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


def update_order_item_package_service(order_item_package, quantity):
    try:
        order_item = order_item_package.order_item
        order_package = order_item_package.package
        qty_order = order_item.qty_ordered

        list_ord_item_package = OrderItemPackage.objects.filter(
            order_item__id=order_item.id
        )
        list_product_alias = ProductAlias.objects.filter(
            merchant_sku=order_item.merchant_sku,
            retailer__id=order_item.order.batch.retailer.id,
        )
        if len(list_product_alias) > 1:
            raise ParseError("Some product alias duplicate merchant_sku")
        if len(list_product_alias) == 0:
            return {
                "status": 400,
                "message": "Not found valid product alias",
            }
        product_alias = list_product_alias[0]

        if quantity <= order_item_package.quantity and quantity != 0:
            order_item_package.quantity = quantity
            order_item_package.save()

            # re-calculating weight of box
            subtract_weight = (
                order_item_package.quantity
                * product_alias.product.weight
                * product_alias.sku_quantity
            )
            item_weight_unit = product_alias.product.weight_unit.upper()
            if item_weight_unit not in ["LB", "LBS"]:
                subtract_weight = convert_weight(
                    weight_value=subtract_weight, weight_unit=item_weight_unit
                )
            old_package_weight = convert_weight(
                weight_value=order_package.weight,
                weight_unit=order_package.weight_unit.upper(),
            )
            order_package.weight_unit = "lbs"
            order_package.weight = old_package_weight - subtract_weight
            order_package.save()

            return {"status": 200, "message": "update success"}

        add_quantity = quantity - order_item_package.quantity

        package_rule = PackageRule.objects.filter(
            product_series__id=product_alias.product.product_series.id,
            box__id=order_item_package.package.box.id,
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
                    box_limit = (
                        box_limit - order_item.quantity * product_alias.sku_quantity
                    )
        if box_limit < quantity * product_alias.sku_quantity:
            return {
                "status": 400,
                "message": f"This box only can contain {box_limit} item this series",
            }
        remain = abs(qty_order - check_qty_order)
        if quantity <= remain and quantity != 0:
            order_item_package.quantity = quantity
            order_item_package.save()

            # re-calculating weight of box
            add_weight = (
                add_quantity * product_alias.product.weight * product_alias.sku_quantity
            )
            item_weight_unit = product_alias.product.weight_unit.upper()
            if item_weight_unit not in ["LB", "LBS"]:
                add_weight = convert_weight(
                    weight_value=add_weight, weight_unit=item_weight_unit
                )
            old_package_weight = convert_weight(
                weight_value=order_package.weight,
                weight_unit=order_package.weight_unit.upper(),
            )
            order_package.weight_unit = "lbs"
            order_package.weight = old_package_weight + add_weight
            order_package.save()

            return {"status": 200, "message": "update success"}
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
