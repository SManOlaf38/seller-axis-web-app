from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from selleraxis.files.services import get_multi_presigned_url


class GetUploadPresignedURLView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "amount",
                openapi.IN_QUERY,
                description="Amount presigned URL",
                type=openapi.TYPE_NUMBER,
            )
        ]
    )
    def get(self, _):
        amount = self.request.query_params.get("amount", default="1")
        if not amount.isdigit():
            raise serializers.ValidationError("amount must be number")

        return Response(
            data=get_multi_presigned_url(int(amount)), status=status.HTTP_200_OK
        )
