from jinja2 import Template, exceptions

from selleraxis.order_item_package.models import OrderItemPackage
from selleraxis.order_package.models import OrderPackage
from selleraxis.package_rules.models import PackageRule
from selleraxis.product_alias.models import ProductAlias
from selleraxis.retailer_carriers.serializers import ServicesSerializerShowInCarrier
from selleraxis.retailer_purchase_order_items.models import RetailerPurchaseOrderItem
from selleraxis.retailer_purchase_orders.models import RetailerPurchaseOrder

KILOS_TO_POUNDS = 2.2046226218488


def convert_weight(element):
    convert_value = {
        "KG": KILOS_TO_POUNDS,
    }
    element_weight_unit = element.get("weight_unit").upper()

    element_weight = element.get("weight")
    element_sku_qty = element.get("item_sku_qty")
    element_qty = element.get("product_qty")

    result = element_weight * element_qty * element_sku_qty
    if element_weight_unit not in ["LB", "LBS"]:
        convert_ratio = convert_value.get(element_weight_unit)
        if convert_ratio is not None:
            return round(result * convert_ratio, 2)

    return round(result, 2)


def divide_process(item_for_series):
    item_for_series.sort(key=lambda x: x["sku_quantity"], reverse=True)
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
    if list_max_quantity[0] < item_for_series[0].get("sku_quantity"):
        return False, []
    else:
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
            if item_in_box_qty >= item_sku_qty:
                item_in_box_qty = item_in_box_qty - (item_in_box_qty % item_sku_qty)
            item_remain_qty = item_qty * item_sku_qty - item_in_box_qty
            box["remain"] = box_remain_qty - item_in_box_qty
            box["element"].append(
                {
                    "order_item_id": item.get("order_item_id"),
                    "item_sku_qty": item_sku_qty,
                    "weight": item.get("weight"),
                    "weight_unit": item.get("weight_unit"),
                    "product_qty": item_in_box_qty // item_sku_qty,
                }
            )
            if item_remain_qty == 0:
                item_for_series.pop(0)
            else:
                item_for_series[0]["qty_order"] = item_remain_qty // item_sku_qty
    completed_result = []
    for idx, box in enumerate(list_box):
        if box["remain"] != 0:
            miss_box = list_box[idx]
            found_valid_qty = False
            box_fill = miss_box["max"] - miss_box["remain"]
            for max_qty in list_max_quantity:
                if max_qty >= box_fill:
                    if box_fill >= max_qty / 2:
                        miss_box["max"] = max_qty
                        miss_box["remain"] = max_qty - box_fill
                        found_valid_qty = True
            if found_valid_qty is True:
                completed_result.append(miss_box)
            else:
                if list_max_quantity[-1] >= box_fill:
                    miss_box["max"] = list_max_quantity[-1]
                    miss_box["remain"] = list_max_quantity[-1] - box_fill
                    completed_result.append(miss_box)
                else:
                    completed_result.append(miss_box)
        else:
            completed_result.append(box)

    for box in completed_result:
        for package_rule in list_uni_package_rule:
            if package_rule.get("max_quantity") == box["max"]:
                box["box_id"] = package_rule.get("box_id")
                box["length"] = package_rule.get("length")
                box["width"] = package_rule.get("width")
                box["height"] = package_rule.get("height")
                box["dimension_unit"] = package_rule.get("dimension_unit")
        box_weight = 0
        for element in box["element"]:
            box_weight += convert_weight(element)
        box["box_weight"] = box_weight
        box["weight_unit"] = "lbs"
    return True, completed_result


def package_divide_service(
    reset: bool, retailer_purchase_order: RetailerPurchaseOrder, retailer_id: int
):
    result = []
    list_order_item = RetailerPurchaseOrderItem.objects.filter(
        order__id=retailer_purchase_order.id
    )
    if not list_order_item:
        return {
            "status": 400,
            "data": {
                "message": f"Not found order item of order id {retailer_purchase_order.id}"
            },
        }
    list_order_package = OrderPackage.objects.filter(
        order__id=retailer_purchase_order.id
    )

    list_item_info = []
    list_merchant_sku = []
    for order_item in list_order_item:
        if order_item.merchant_sku not in list_merchant_sku:
            list_merchant_sku.append(order_item.merchant_sku)
            list_item_info.append(
                {
                    "order_item_id": order_item.id,
                    "qty_order": order_item.qty_ordered,
                }
            )
    list_uni_series = []
    list_product_alias = ProductAlias.objects.filter(
        merchant_sku__in=list_merchant_sku,
        retailer_id=retailer_id,
    )
    for order_item in list_order_item:
        found_valid_alias = False
        for product_alias in list_product_alias:
            if order_item.merchant_sku == product_alias.merchant_sku:
                found_valid_alias = True
                break
        if found_valid_alias is False:
            return {
                "status": 400,
                "data": {"message": "Some order item don't have product alias"},
            }

    for product_alias in list_product_alias:
        if product_alias.product.product_series.id not in list_uni_series:
            list_uni_series.append(product_alias.product.product_series.id)
        for order_item in list_order_item:
            if order_item.merchant_sku == product_alias.merchant_sku:
                for item_info in list_item_info:
                    if item_info.get("order_item_id") == order_item.id:
                        item_info[
                            "product_series_id"
                        ] = product_alias.product.product_series.id
                        item_info["product_id"] = product_alias.product.id
                        item_info["sku_quantity"] = product_alias.sku_quantity
                        item_info["weight"] = product_alias.product.weight
                        item_info["weight_unit"] = product_alias.product.weight_unit
    if len(list_uni_series) == 0:
        return {
            "status": 400,
            "data": {
                "message": f"Not found product series for item of order id {retailer_purchase_order.id}"
            },
        }
    list_package_rule = PackageRule.objects.filter(
        product_series__id__in=list_uni_series
    )
    if not list_package_rule:
        return {
            "status": 400,
            "data": {
                "message": f"Not found box for item of order id {retailer_purchase_order.id}"
            },
        }
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
                "dimension_unit": package_rule.box.dimension_unit,
            }
            if item not in list_box_info:
                if item_info.get("product_series_id") == package_rule.product_series.id:
                    list_box_info.append(item)
        item_info["box_divide_info"] = list_box_info

    if list_order_package:
        if reset is False:
            list_order_item_packages = OrderItemPackage.objects.filter(
                package__in=list_order_package
            )
            for order_package in list_order_package:
                for item in list_order_item_packages:
                    for item_info in list_item_info:
                        if item.order_item.id == item_info.get("order_item_id"):
                            for divide_info in item_info.get("box_divide_info"):
                                if order_package.box.id == divide_info.get("box_id"):
                                    result_item = {
                                        "order_package_id": order_package.id,
                                        "max_quantity": divide_info.get("max_quantity"),
                                    }
                                    if result_item not in result:
                                        result.append(result_item)

            return {"status": 200, "data": result}
        else:
            list_order_item_packages = OrderItemPackage.objects.filter(
                package__in=list_order_package
            )
            list_order_item_packages.delete()
            list_order_package.delete()

    divide_result = []
    if retailer_purchase_order.is_divide is True:
        if reset is False:
            return {
                "status": 400,
                "data": {"message": "Order was divided"},
            }
    for series in list_uni_series:
        item_for_series = []
        for item_info in list_item_info:
            if series == item_info.get("product_series_id"):
                item_for_series.append(item_info)
        if len(item_for_series) != 0:
            divide_status, divide_solution = divide_process(
                item_for_series=item_for_series
            )
            if divide_status:
                divide_result += divide_solution
            else:
                return {
                    "status": 500,
                    "data": {"message": "Box max quantity is in valid"},
                }
    if len(divide_result) > 0:
        retailer_purchase_order.is_divide = True
        retailer_purchase_order.save()
        for data_item in divide_result:
            new_order_package = OrderPackage(
                box_id=data_item.get("box_id"),
                order_id=retailer_purchase_order.id,
                length=data_item.get("length"),
                width=data_item.get("width"),
                height=data_item.get("height"),
                dimension_unit=data_item.get("dimension_unit"),
                weight=data_item.get("box_weight"),
                weight_unit=data_item.get("weight_unit"),
            )
            new_order_package.save()
            for qty in data_item.get("element"):
                new_order_item_package = OrderItemPackage(
                    quantity=qty.get("product_qty"),
                    package_id=new_order_package.id,
                    order_item_id=qty.get("order_item_id"),
                )
                new_order_item_package.save()
                for item_info in list_item_info:
                    if new_order_item_package.order_item.id == item_info.get(
                        "order_item_id"
                    ):
                        for divide_info in item_info.get("box_divide_info"):
                            if new_order_package.box.id == divide_info.get("box_id"):
                                result_item = {
                                    "order_package_id": new_order_package.id,
                                    "max_quantity": divide_info.get("max_quantity"),
                                }
                                if result_item not in result:
                                    result.append(result_item)

    return {"status": 200, "data": result}


def get_shipping_ref(obj, response, shipping_ref_type, value):
    if response == "" and shipping_ref_type is not None:
        str_data_field = shipping_ref_type.data_field
        if str_data_field is None:
            str_data_field = ""
        value_response = value.replace(
            "{{" + shipping_ref_type.name + "}}", str_data_field
        )
        if shipping_ref_type.data_field is not None:
            try:
                template = Template(value_response)
                result = template.render(order=obj)
            except exceptions.UndefinedError:
                response = value.replace("{{" + shipping_ref_type.name + "}}", "")
                return response
            response = result
        else:
            response = value_response
    return response


def get_shipping_ref_code(carrier, shipping_ref_type):
    if carrier and shipping_ref_type:
        service = carrier.service
        data_service = ServicesSerializerShowInCarrier(service).data
        for shipping_ref_item in data_service["shipping_ref_service"]:
            if shipping_ref_item["type"] == shipping_ref_type.id:
                return shipping_ref_item["code"]
    return None
