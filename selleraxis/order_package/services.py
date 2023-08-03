from rest_framework.exceptions import ParseError

from selleraxis.order_item_package.models import OrderItemPackage
from selleraxis.order_package.models import OrderPackage


def delete_order_package_service(order_id_package: int):
    try:
        order_package = OrderPackage.objects.filter(id=order_id_package).first()
        if not order_package:
            raise ParseError("Order package id not exist!")

        list_order_package_item = OrderItemPackage.objects.filter(
            package__id=order_package.id
        )
        list_order_package_item.delete()
        order_package.delete()

        return "delete success"

    except Exception as error:
        raise error
