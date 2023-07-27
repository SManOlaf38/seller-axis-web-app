from rest_framework.exceptions import ParseError

from selleraxis.order_item_package.models import OrderItemPackage
from selleraxis.order_package.models import OrderPackage
from selleraxis.package_rules.models import PackageRule
from selleraxis.product_alias.models import ProductAlias
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem


def divide_process(item_for_series):
    item_for_series.sort(key=lambda x: x["qty_order"])
    item_for_series.reverse()
    list_uni_package_rule = []
    for item in item_for_series:
        for package_rule_info in item.get("box_divide_info"):
            if package_rule_info not in list_uni_package_rule:
                package_rule_info["order_item_id"] = item.get("order_item_id")
                list_uni_package_rule.append(package_rule_info)
    list_max_quantity = []
    for package_rule in list_uni_package_rule:
        if package_rule.get("max_quantity") not in list_max_quantity:
            list_max_quantity.append(package_rule.get("max_quantity"))
    list_max_quantity = sorted(list_max_quantity, reverse=True)
    list_box = []
    while len(item_for_series) > 0:
        item = item_for_series[0]
        item_sku_qty = item.get("sku_quantity")
        item_qty = item.get("qty_order")
        max_qty = list_max_quantity[0]
        box = None
        for box_item in list_box:
            if box_item.get("remain") >= item_sku_qty:
                box = box_item
                break
        if box is None:
            box = {"max": max_qty, "remain": max_qty, "element": []}
            list_box.append(box)
        box_remain_qty = box["remain"]
        item_in_box_qty = min(box_remain_qty, item_qty * item_sku_qty)
        item_in_box_qty = item_in_box_qty - (item_in_box_qty % item_sku_qty)
        item_remain_qty = item_qty * item_sku_qty - item_in_box_qty
        box["remain"] = box_remain_qty - item_in_box_qty
        box["element"].append(
            {
                "order_item_id": item.get("order_item_id"),
                "item_sku_qty": item_sku_qty,
                "product_qty": item_in_box_qty // item_sku_qty,
            }
        )
        if item_remain_qty == 0:
            item_for_series.pop(0)
        else:
            item_for_series[0]["qty_order"] = item_remain_qty // item_sku_qty
    for idx, box in enumerate(list_box):
        if box["remain"] != 0:
            miss_box = list_box.pop(idx)
            for max_qty in list_max_quantity[1:]:
                box_fill = miss_box["max"] - miss_box["remain"]
                if max_qty > box_fill:
                    miss_box["max"] = max_qty
                    miss_box["remain"] = max_qty - box_fill
                    list_box.append(miss_box)
                    break
    for box in list_box:
        for package_rule in list_uni_package_rule:
            if package_rule.get("max_quantity") == box["max"]:
                box["box_id"] = package_rule.get("box_id")
                box["length"] = package_rule.get("length")
                box["width"] = package_rule.get("width")
                box["height"] = package_rule.get("height")
    return list_box


def package_divide_service(retailer_purchase_order_id: int):
    list_order_item = RetailerPurchaseOrderItem.objects.filter(
        order__id=retailer_purchase_order_id
    )
    if not list_order_item:
        raise ParseError("Retailer purchase order id not exist!")

    list_item_info = []
    list_vendor_sku = []
    for order_item in list_order_item:
        if order_item.vendor_sku not in list_vendor_sku:
            list_vendor_sku.append(order_item.vendor_sku)
            list_item_info.append(
                {
                    "order_item_id": order_item.id,
                    "qty_order": order_item.qty_ordered,
                }
            )
    list_uni_series = []
    list_product_alias = ProductAlias.objects.filter(sku__in=list_vendor_sku)

    for product_alias in list_product_alias:
        if product_alias.product.product_series.id not in list_uni_series:
            list_uni_series.append(product_alias.product.product_series.id)
        for order_item in list_order_item:
            if order_item.vendor_sku == product_alias.sku:
                for item_info in list_item_info:
                    if item_info.get("order_item_id") == order_item.id:
                        item_info[
                            "product_series_id"
                        ] = product_alias.product.product_series.id
                        item_info["product_id"] = product_alias.product.id
                        item_info["sku_quantity"] = product_alias.sku_quantity

    list_package_rule = PackageRule.objects.filter(
        product_series__id__in=list_uni_series
    )
    for item_info in list_item_info:
        list_box_info = []
        for package_rule in list_package_rule:
            item = {
                "box_id": package_rule.box.id,
                "box_name": package_rule.box.name,
                "max_quantity": package_rule.max_quantity,
                "length": package_rule.box.length,
                "width": package_rule.box.width,
                "height": package_rule.box.height,
            }
            if item not in list_box_info:
                if item_info.get("product_series_id") == package_rule.product_series.id:
                    list_box_info.append(item)
        item_info["box_divide_info"] = list_box_info

    result = []
    for series in list_uni_series:
        item_for_series = []
        for item_info in list_item_info:
            if series == item_info.get("product_series_id"):
                item_for_series.append(item_info)
        if len(item_for_series) != 0:
            divide_solution = divide_process(item_for_series=item_for_series)
            result += divide_solution

    for data_item in result:
        new_order_package = OrderPackage(
            box_id=data_item.get("box_id"),
            order_id=retailer_purchase_order_id,
            length=data_item.get("length"),
            width=data_item.get("width"),
            height=data_item.get("height"),
        )
        new_order_package.save()
        for qty in data_item.get("element"):
            new_order_item_package = OrderItemPackage(
                quantity=qty.get("product_qty"),
                package_id=new_order_package.id,
                order_item_id=qty.get("order_item_id"),
            )
            new_order_item_package.save()

    return result
