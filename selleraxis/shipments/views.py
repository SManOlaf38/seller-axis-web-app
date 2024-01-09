import base64

from django.db.models import Case, IntegerField, Value, When
from django.forms import model_to_dict
from rest_framework import status
from rest_framework.exceptions import ParseError, ValidationError
from rest_framework.generics import DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
from selleraxis.product_alias.models import ProductAlias
from selleraxis.products.models import Product
from selleraxis.retailer_purchase_order_histories.models import (
    RetailerPurchaseOrderHistory,
)
from selleraxis.retailer_purchase_orders.models import QueueStatus
from selleraxis.service_api.models import ServiceAPI, ServiceAPIAction
from selleraxis.shipments.models import Shipment, ShipmentStatus
from selleraxis.shipments.serializers import ShipmentSerializer


class CancelShipmentView(DestroyAPIView):
    queryset = Shipment.objects.all()
    model = ShipmentSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(
            carrier__organization__id=self.request.headers.get("organization")
        ).select_related(
            "carrier",
            "type",
            "package",
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        is_sandbox = instance.carrier.organization.is_sandbox
        if instance.status.upper() != ShipmentStatus.CREATED:
            raise ParseError("Only created status shipment can be voiced")
        origin_string = f"{instance.carrier.client_id}:{instance.carrier.client_secret}"
        to_binary = origin_string.encode("UTF-8")
        basic_auth = (base64.b64encode(to_binary)).decode("ascii")

        login_api = ServiceAPI.objects.filter(
            service_id=instance.carrier.service, action=ServiceAPIAction.LOGIN
        ).first()

        try:
            login_response = login_api.request(
                {
                    "client_id": instance.carrier.client_id,
                    "client_secret": instance.carrier.client_secret,
                    "basic_auth": basic_auth,
                },
                is_sandbox=is_sandbox,
            )
        except KeyError:
            raise ValidationError(
                {"error": "Login to service fail!"},
                code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        cancel_shipment_data = model_to_dict(instance)
        cancel_shipment_data["access_token"] = login_response["access_token"]
        cancel_shipment_data["carrier"] = model_to_dict(instance.carrier)

        cancel_shipment_api = ServiceAPI.objects.filter(
            service_id=instance.carrier.service, action=ServiceAPIAction.CANCEL_SHIPPING
        ).first()

        try:
            cancel_shipment_response = cancel_shipment_api.request(
                cancel_shipment_data,
                is_sandbox=is_sandbox,
            )
        except KeyError:
            raise ParseError("Shipment void fail!")
        if (
            isinstance(cancel_shipment_response["status"], bool)
            and cancel_shipment_response["status"] is True
        ) or (
            isinstance(cancel_shipment_response["status"], str)
            and cancel_shipment_response["status"].lower() == "success"
        ):
            instance.status = ShipmentStatus.VOIDED
            instance.save()
            order_package = instance.package
            order_package.save()

            order_voided = instance.package.order
            order_voided.refresh_from_db()
            list_order_package = order_voided.order_packages.all().prefetch_related(
                "shipment_packages"
            )
            list_order_package_shipped = list_order_package.filter(
                shipment_packages__status__in=[
                    ShipmentStatus.CREATED,
                    ShipmentStatus.SUBMITTED,
                ]
            )
            if len(list_order_package_shipped) > 0:
                if order_voided.status.upper() == QueueStatus.Shipped.value.upper():
                    order_voided.status = QueueStatus.Partly_Shipped.value
                    order_voided.save()
            else:
                list_order_history_for_order = (
                    RetailerPurchaseOrderHistory.objects.filter(
                        order__id=order_voided.id,
                        status__in=[
                            QueueStatus.Opened,
                            QueueStatus.Acknowledged,
                            QueueStatus.Bypassed_Acknowledge,
                        ],
                    )
                    .order_by("-created_at")
                    .first()
                )
                if list_order_history_for_order is not None:
                    order_voided.status = list_order_history_for_order.status
                    order_voided.save()

            list_item_package = order_package.order_item_packages.all().select_related(
                "order_item__order__batch__retailer"
            )
            list_product_alias = ProductAlias.objects.filter(
                merchant_sku__in=[
                    item_package.order_item.merchant_sku
                    for item_package in list_item_package
                ],
                retailer__id__in=[
                    item_package.order_item.order.batch.retailer.id
                    for item_package in list_item_package
                ],
            ).select_related("retailer", "product")
            product_ids = [
                product_alias.product.id for product_alias in list_product_alias
            ]
            list_product = Product.objects.filter(id__in=product_ids)
            # check item package of voided package
            for item_package in list_item_package:
                # find product alias
                valid_alias = None
                for product_alias in list_product_alias:
                    if (
                        item_package.order_item.merchant_sku
                        == product_alias.merchant_sku
                        and item_package.order_item.order.batch.retailer.id
                        == product_alias.retailer.id
                    ):
                        valid_alias = product_alias
                        break
                # update qty pending if alias valid
                if valid_alias is not None:
                    qty = int(valid_alias.sku_quantity) * int(item_package.quantity)
                    for product in list_product:
                        if product.id == valid_alias.product.id:
                            qty_pending = product.qty_pending
                            product.qty_pending = qty_pending + qty
                else:
                    raise ParseError(
                        "Some items don't have product alias, can't update pending quantity"
                    )
            # update bulk
            whens = [
                When(id=product.id, then=Value(int(product.qty_pending)))
                for product in list_product
            ]
            list_product.update(qty_pending=Case(*whens, output_field=IntegerField()))

            return Response(
                data={
                    "message": "Shipment voided success!",
                    "status": instance.status.upper(),
                },
                status=status.HTTP_200_OK,
            )
        else:
            raise ParseError("Shipment void fail!")

    def check_permissions(self, _):
        return check_permission(self, Permissions.CANCEL_SHIPMENT)
