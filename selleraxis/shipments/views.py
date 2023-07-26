from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response

from selleraxis.shipments.serializers import ShipmentSerializer


class CreateShipmentView(CreateAPIView):
    serializer_class = ShipmentSerializer

    def post(self, request, *args, **kwargs):
        serializer = ShipmentSerializer(data=request.data)

        if serializer.is_valid():
            response = {
                "id": 1,
                "status": "success",
                "tracking_number": "1234125145",
                "payment_account": "infibrite",
                "package_document": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fconnectship.com%2Fassets%2F"
                "images%2Fproducts%2FCustomDocs_Packing.jpg&tbnid=tL97wYpvp-fj9M&vet=12ahUKEwie27ORrquAAxW_ePUHHSHk"
                "CfkQMygNegUIARDuAQ..i&imgrefur l=https%3A%2F%2Fconnectship.com%2Fproducts%2Fcustomdocuments%2F&docid"
                "=423hfcW8fp64MM&w=348&h=222&q=package_document&ved=2ahUKEwie27ORrquAAxW_ePUHHSHkCfkQMygNegUIARDuAQ",
                "identification_number": "45124",
                "retailer_carrier": {
                    "id": 1,
                    "client_id": "12341",
                    "client_secret": "fgafbadfgfafgetgf",
                    "service": 1,
                    "retailer": 1,
                    "created_at": "2023-07-25T07:08:19.306477Z",
                    "updated_at": "2023-07-25T07:08:19.306492Z",
                },
                "order": {
                    "id": 1,
                    "retailer_purchase_order_id": "string",
                    "transaction_id": "string",
                    "senders_id_for_receiver": "string",
                    "po_number": "string",
                    "shipping_code": "string",
                    "sales_division": "string",
                    "vendor_warehouse_id": "string",
                    "cust_order_number": "string",
                    "po_hdr_data": {},
                    "control_number": "string",
                    "buying_contract": "string",
                    "participating_party": 0,
                    "ship_to": 0,
                    "bill_to": 0,
                    "invoice_to": 0,
                    "verified_ship_to": 0,
                    "customer": 0,
                    "batch": 0,
                    "created_at": "2023-07-25T07:08:19.306477Z",
                    "updated_at": "2023-07-25T07:08:19.306492Z",
                },
                "created_at": "2023-07-25T07:08:19.306477Z",
                "updated_at": "2023-07-25T07:08:19.306492Z",
            }

            return Response(response, status=status.HTTP_200_OK)
        return Response({"err: bug"}, status=status.HTTP_400_BAD_REQUEST)
