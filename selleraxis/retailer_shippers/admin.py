from django.contrib import admin

from selleraxis.retailer_shippers.models import RetailerShipper


@admin.register(RetailerShipper)
class RetailerShipperAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "attention_name",
        "tax_identification_number",
        "phone",
        "email",
        "shipper_number",
        "fax_number",
        "address",
        "city",
        "state",
        "postal_code",
        "country",
        "company",
        "retailer_carrier",
        "created_at",
        "updated_at",
    )
