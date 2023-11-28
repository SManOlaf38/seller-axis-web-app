import base64

from django.forms import model_to_dict
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import DestroyAPIView
from rest_framework.permissions import IsAuthenticated

from selleraxis.core.permissions import check_permission
from selleraxis.permissions.models import Permissions
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
            carrier__retailer__organization_id=self.request.headers.get("organization")
        ).select_related(
            "carrier",
            "type",
        )

    def perform_destroy(self, instance: Shipment):
        if instance.status is ShipmentStatus.CREATED:
            origin_string = (
                f"{instance.carrier.client_id}:{instance.carrier.client_secret}"
            )
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
                    }
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
                service_id=instance.carrier.service,
                action=ServiceAPIAction.CANCEL_SHIPPING,
            ).first()

            try:
                cancel_shipment_response = cancel_shipment_api.request(
                    cancel_shipment_data
                )
            except KeyError:
                raise ValidationError(
                    {"error": "Cancel shipment fail!"},
                    code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            if (
                isinstance(cancel_shipment_response["status"], bool)
                and cancel_shipment_response["status"] is True
            ) or (
                isinstance(cancel_shipment_response["status"], str)
                and cancel_shipment_response["status"].lower() == "success"
            ):
                instance.status = ShipmentStatus.VOIDED
                instance.save()
            else:
                raise ValidationError(
                    {"error": "Cancel shipment fail!"},
                    code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

    def check_permissions(self, _):
        return check_permission(self, Permissions.CANCEL_SHIPMENT)
