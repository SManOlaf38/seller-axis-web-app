from django.db.models import Q
from rest_framework import exceptions, serializers

from selleraxis.product_series.models import ProductSeries
from selleraxis.product_series.serializers import ProductSeriesSerializer
from selleraxis.products.models import Product


class ProductSerializer(serializers.ModelSerializer):
    def validate(self, data):
        if "upc" in data and not str(data["upc"]).isnumeric():
            raise exceptions.ParseError("UPC codes must be numeric.")
        organization_id = self.context["view"].request.headers.get("organization", None)
        id = self.context.get("request").parser_context.get("kwargs").get("id")
        if organization_id is None:
            raise exceptions.ParseError("Miss organization id")
        if "product_series" not in data:
            raise exceptions.ParseError("Miss product series")
        product_series = ProductSeries.objects.filter(
            id=data["product_series"].id, organization_id=organization_id
        ).first()
        if not product_series:
            raise exceptions.ParseError("This product series not exist")
        data_upc = data.get("upc", "")
        data_sku = data.get("sku", "")
        check_unique = Product.objects.filter(
            Q(upc=data_upc, product_series__organization_id=organization_id)
            | Q(sku=data_sku, product_series__organization_id=organization_id)
        )
        if len(check_unique) > 0:
            for item in check_unique:
                if item.upc == data_upc:
                    if id is None or int(item.id) != int(id):
                        raise exceptions.ParseError("Upc must unique")
                elif item.sku == data_sku:
                    if id is None or int(item.id) != int(id):
                        raise exceptions.ParseError("Sku must unique")
        return data

    class Meta:
        model = Product
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            "qbo_account_ref_name": {"read_only": True},
            "qbo_account_ref_id": {"read_only": True},
            "qbo_product_id": {"read_only": True},
            "sync_token": {"read_only": True},
            "inv_start_date": {"read_only": True},
        }


class BulkCreateProductSerializer(serializers.ModelSerializer):
    product_series_name = serializers.CharField(max_length=255, write_only=True)

    def validate(self, data):
        if "upc" in data and not str(data["upc"]).isnumeric():
            raise exceptions.ParseError("UPC codes must be numeric.")
        if "product_series_name" not in data:
            raise exceptions.ParseError("Miss product_series_name")
        organization_id = self.context["view"].request.headers.get("organization", None)
        if organization_id is None:
            raise exceptions.ParseError("Miss organization id")
        product_series = ProductSeries.objects.filter(
            series=data["product_series_name"], organization_id=organization_id
        ).first()
        if not product_series:
            raise exceptions.ParseError("This product series not exist")
        check_unique = Product.objects.filter(
            Q(upc=data["upc"], product_series__organization_id=organization_id)
            | Q(sku=data["sku"], product_series__organization_id=organization_id)
        )
        if len(check_unique) > 0:
            for item in check_unique:
                if item.upc == data["upc"]:
                    raise exceptions.ParseError("Upc must unique")
                elif item.sku == data["sku"]:
                    raise exceptions.ParseError("Sku must unique")
        data.pop("product_series_name")
        data["product_series"] = product_series
        return data

    class Meta:
        model = Product
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
            # "product_series": {"read_only": True},
        }


class ReadProductSerializer(serializers.ModelSerializer):
    product_series = ProductSeriesSerializer(read_only=True)

    class Meta:
        model = Product
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }


class CreateQuickbookProductSerializer(serializers.Serializer):
    action = serializers.CharField(max_length=255, required=True)
    model = serializers.CharField(max_length=255, required=True)
    object_id = serializers.IntegerField(required=True)
    is_sandbox = serializers.BooleanField(required=True)
