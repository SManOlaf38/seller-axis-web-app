from rest_framework.exceptions import ParseError

from selleraxis.boxes.models import Box
from selleraxis.core.utils.convert_weight_by_unit import convert_weight
from selleraxis.order_item_package.models import OrderItemPackage
from selleraxis.order_package.models import OrderPackage
from selleraxis.package_rules.models import PackageRule
from selleraxis.product_alias.models import ProductAlias
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem


def create_order_package_service(box_id, list_item, is_check=None):
    try:
        list_create_info = []
        list_item_id = []
        for add_item in list_item:
            if add_item.get("order_item") not in list_item_id:
                list_item_id.append(add_item.get("order_item"))

        # get list order item
        list_order_item = RetailerPurchaseOrderItem.objects.filter(
            id__in=list_item_id
        ).select_related("order__batch__retailer")
        if not list_order_item and len(list_order_item) < len(list_item_id):
            raise ParseError("One or more item not exist")
        list_merchant_sku = []
        list_retailer_id = []
        for order_item in list_order_item:
            for input_data in list_item:
                if input_data.get("order_item") == order_item.id:
                    if order_item.merchant_sku not in list_merchant_sku:
                        list_merchant_sku.append(order_item.merchant_sku)
                    if order_item.order.batch.retailer_id not in list_retailer_id:
                        list_retailer_id.append(order_item.order.batch.retailer_id)
                    info_item = {
                        "order_item": order_item,
                        "merchant_sku": order_item.merchant_sku,
                        "retailer_id": order_item.order.batch.retailer_id,
                        "quantity": input_data.get("quantity"),
                    }
                    list_create_info.append(info_item)

        # get list product alias for list order item
        list_product_alias = ProductAlias.objects.filter(
            merchant_sku__in=list_merchant_sku,
            retailer_id__in=list_retailer_id,
        ).select_related("product__product_series")
        for info_item in list_create_info:
            alias_valid = False
            list_product_series_id = []

            for product_alias in list_product_alias:
                if (
                    product_alias.product.product_series.id
                    not in list_product_series_id
                ):
                    list_product_series_id.append(
                        product_alias.product.product_series.id
                    )

                if product_alias.merchant_sku == info_item.get(
                    "merchant_sku"
                ) and product_alias.retailer_id == info_item.get("retailer_id"):
                    if info_item.get("product_alias") is not None:
                        raise ParseError(
                            f'Item {info_item.get("order_item").id} have product alias duplicate merchant_sku'
                        )
                    info_item["product_alias"] = product_alias
                    info_item[
                        "product_series_id"
                    ] = product_alias.product.product_series.id
                    alias_valid = True
            if alias_valid is False:
                raise ParseError(
                    f'Item {info_item.get("order_item").id} not found valid product alias'
                )

        # check all item in same series
        if len(list_product_series_id) > 1:
            raise ParseError("Order have items in another series")

        # check box exist
        box = Box.objects.filter(id=box_id).first()
        if not box:
            raise ParseError(f"Box id {box_id} not exist")

        # find valid package rule
        list_package_rule = PackageRule.objects.filter(
            product_series__id__in=list_product_series_id, box__id=box.id
        ).select_related("box")
        if len(list_package_rule) > 1:
            raise ParseError("Some item have more than one package rule")
        elif len(list_package_rule) == 0:
            raise ParseError("Not have package rule")
        for info_item in list_create_info:
            package_rule_valid = False
            for package_rule in list_package_rule:
                if (
                    package_rule.product_series.id == info_item.get("product_series_id")
                    and package_rule.box.id == box.id
                ):
                    if info_item.get("package_rule") is not None:
                        raise ParseError(
                            f'Item {info_item.get("product_alias").sku} has more than one package rule'
                        )
                    info_item["package_rule"] = package_rule
                    package_rule_valid = True
                if package_rule_valid is False:
                    raise ParseError(
                        f'Item {info_item.get("product_alias").sku} not have package rule'
                    )

        # check quantity
        max_quantity = list_package_rule[0].max_quantity
        list_ord_item_package = OrderItemPackage.objects.filter(
            order_item__id__in=list_item_id
        )
        package_weight = 0
        check_quantity = True
        for info_item in list_create_info:
            order_item = info_item.get("order_item")
            quantity = info_item.get("quantity")
            qty_order = order_item.qty_ordered
            product_alias = info_item.get("product_alias")

            # check is full box or no
            if quantity * product_alias.sku_quantity > max_quantity or max_quantity < 0:
                check_quantity = False
                raise ParseError(
                    f'This box only can contain {max_quantity} item {info_item.get("product_alias").sku}'
                )
            else:
                max_quantity = max_quantity - quantity * product_alias.sku_quantity

            # check item quantity
            list_ord_item_package_by_item_id = list_ord_item_package.filter(
                order_item__id=order_item.id
            )
            check_qty_order = 0
            for order_item_package in list_ord_item_package_by_item_id:
                check_qty_order += order_item_package.quantity
            remain = abs(qty_order - check_qty_order)

            if quantity == 0:
                check_quantity = False
                raise ParseError(
                    f'Item {info_item.get("product_alias").sku} quantity must be not equal 0'
                )

            if quantity > remain:
                check_quantity = False
                if remain == 0:
                    raise ParseError(
                        f'Item {info_item.get("product_alias").sku} is max quantity'
                    )
                else:
                    raise ParseError(
                        f'Item {info_item.get("product_alias").sku} only need {remain} and quantity must not 0'
                    )

            add_package_weight = (
                product_alias.product.weight * quantity * product_alias.sku_quantity
            )
            package_weight_unit = product_alias.product.weight_unit
            if package_weight_unit.upper() not in ["LB", "LBS"]:
                package_weight += convert_weight(
                    weight_value=add_package_weight,
                    weight_unit=package_weight_unit.upper(),
                )

        # return base on is_check if list item pass check process
        if check_quantity is True:
            if is_check == "true":
                return {"message": "Package is valid to creating!"}
            else:
                new_order_package = OrderPackage(
                    box_id=box.id,
                    order_id=list_create_info[0].get("order_item").order.id,
                    length=box.length,
                    width=box.width,
                    height=box.height,
                    dimension_unit=box.dimension_unit,
                    weight=package_weight,
                    weight_unit="lbs",
                )
                new_order_package.save()
                for info_item in list_create_info:
                    order_item = info_item.get("order_item")
                    quantity = info_item.get("quantity")

                    if is_check is None or is_check == "false":
                        new_order_item_package = OrderItemPackage(
                            quantity=quantity,
                            package_id=new_order_package.id,
                            order_item_id=order_item.id,
                        )
                        new_order_item_package.save()
                message_data = {
                    "object_id": new_order_package.id,
                }
                return {"message": message_data}

    except Exception as error:
        raise error


def delete_order_package_service(order_id_package: int):
    try:
        order_package = OrderPackage.objects.filter(id=order_id_package).first()
        if not order_package:
            raise ParseError("Order package id not exist!")
        shipment_packages = order_package.shipment_packages.all()
        if shipment_packages is not None and len(shipment_packages) > 0:
            raise ParseError("This order package status is shipped can be deleted")
        order_package.delete()

        return "delete success"

    except Exception as error:
        raise error
