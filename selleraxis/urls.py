"""selleraxis URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from selleraxis.addresses.views import ListCreateAddressView, UpdateDeleteAddressView
from selleraxis.barcode_sizes.views import (
    BulkBarcodeSizeView,
    ListCreateBarcodeSizeView,
    UpdateDeleteBarcodeSizeView,
)
from selleraxis.boxes.views import BulkBoxesView, ListCreateBoxView, UpdateDeleteBoxView
from selleraxis.core.swagger import CustomerGeneratorSchema
from selleraxis.files.views import GetUploadPresignedURLView
from selleraxis.getting_order_histories.views import ListGettingOrderHistoryView
from selleraxis.gs1.views import BulkGS1View, ListCreateGS1View, UpdateDeleteGS1View
from selleraxis.invoice.views import (
    CreateInvoiceView,
    CreateQBOTokenView,
    GetQBOAuthorizationURLView,
    InvoiceCreateXMLAPIView,
    SQSSyncUnhandledDataView,
)
from selleraxis.order_item_package.views import (
    ListCreateOrderItemPackageView,
    UpdateDeleteOrderItemPackageView,
)
from selleraxis.order_package.views import (
    BulkOrderPackage,
    ListCreateOrderPackageView,
    UpdateDeleteOrderPackageView,
)
from selleraxis.organizations.views import (
    ListCreateOrganizationView,
    UpdateDeleteOrganizationView,
)
from selleraxis.package_rules.views import (
    ListCreatePackageRuleView,
    UpdateDeletePackageRuleView,
)
from selleraxis.permissions.views import ListPermissionView
from selleraxis.product_alias.views import (
    BulkUpdateProductAliasView,
    ListCreateProductAliasView,
    ProductAliasInventoryXMLView,
    UpdateDeleteProductAliasView,
)
from selleraxis.product_series.views import (
    BulkProductSeriesView,
    ListCreateProductSeriesView,
    UpdateDeleteProductSeriesView,
)
from selleraxis.product_warehouse_static_data.views import (
    BulkUpdateDeleteProductWarehouseStaticDataView,
    GetRetailerToUpdateInventoryView,
    ListCreateProductWarehouseStaticDataView,
    UpdateDeleteProductWarehouseStaticDataView,
)
from selleraxis.products.views import (
    BulkManualCreateProductQBOView,
    BulkProductView,
    ListCreateProductView,
    ManualCreateProductQBOView,
    UpdateCreateQBOView,
    UpdateDeleteProductView,
)
from selleraxis.retailer_carriers.views import (
    BulkRetailerCarrierView,
    ListCreateRetailerCarrierView,
    UpdateDeleteRetailerCarrierView,
)
from selleraxis.retailer_commercehub_sftp.views import (
    ListCreateRetailerCommercehubSFTPView,
    RetailerCommercehubSFTPGetOrderView,
    UpdateDeleteRetailerCommercehubSFTPView,
)
from selleraxis.retailer_order_batchs.views import (
    ListCreateRetailerOrderBatchView,
    UpdateDeleteRetailerOrderBatchView,
)
from selleraxis.retailer_participating_parties.views import (
    ListCreateRetailerParticipatingPartyView,
    UpdateDeleteRetailerParticipatingPartyView,
)
from selleraxis.retailer_partners.views import (
    ListCreateRetailerPartnerView,
    UpdateDeleteRetailerPartnerView,
)
from selleraxis.retailer_person_places.views import (
    ListCreateRetailerPersonPlaceView,
    UpdateDeleteRetailerPersonPlaceView,
)
from selleraxis.retailer_purchase_order_items.views import (
    ListCreateRetailerPurchaseOrderItemView,
    UpdateDeleteRetailerPurchaseOrderItemView,
)
from selleraxis.retailer_purchase_order_notes.views import (
    ListCreateRetailerPurchaseOrderNoteView,
    UpdateDeleteRetailerPurchaseOrderNoteView,
)
from selleraxis.retailer_purchase_order_return_items.views import (
    ListCreateRetailerPurchaseOrderReturnItemView,
    RetrieveRetailerPurchaseOrderReturnItemView,
)
from selleraxis.retailer_purchase_order_return_notes.views import (
    ListCreateRetailerPurchaseOrderReturnNoteView,
    UpdateDeleteRetailerPurchaseOrderReturnNoteView,
)
from selleraxis.retailer_purchase_order_returns.views import (
    ListCreateRetailerPurchaseOrderReturnView,
    RetrieveRetailerPurchaseOrderReturnView,
)
from selleraxis.retailer_purchase_orders.views import (
    DailyPicklistAPIView,
    ListCreateRetailerPurchaseOrderView,
    OrderStatusIsBypassedAcknowledge,
    OrganizationPurchaseOrderCheckView,
    OrganizationPurchaseOrderImportView,
    PackageDivideResetView,
    RetailerPurchaseOrderAcknowledgeBulkCreateAPIView,
    RetailerPurchaseOrderAcknowledgeCreateAPIView,
    RetailerPurchaseOrderBackorderCreateAPIView,
    RetailerPurchaseOrderShipmentCancelCreateAPIView,
    RetailerPurchaseOrderShipmentConfirmationCreateAPIView,
    SearchRetailerPurchaseOrderView,
    ShipFromAddressView,
    ShippingBulkCreateAPIView,
    ShippingView,
    ShipToAddressValidationBulkCreateAPIView,
    ShipToAddressValidationView,
    UpdateDeleteRetailerPurchaseOrderView,
)
from selleraxis.retailer_queue_histories.views import (
    ListRetailerQueueHistoryView,
    UpdateDeleteRetailerQueueHistoryView,
)
from selleraxis.retailer_shippers.views import (
    ListCreateRetailerShipperView,
    UpdateDeleteRetailerShipperView,
)
from selleraxis.retailer_suggestion.views import RetailerSuggestionAPIView
from selleraxis.retailer_warehouse_products.views import (
    ListCreateRetailerWarehouseProductView,
    UpdateDeleteRetailerWarehouseProductView,
)
from selleraxis.retailer_warehouses.views import (
    BulkRetailerWarehouseView,
    ListCreateRetailerWarehouseView,
    UpdateDeleteRetailerWarehouseView,
)
from selleraxis.retailers.views import (
    BulkManualCreateRetailerQBOView,
    ImportDataPurchaseOrderView,
    ListCreateRetailerView,
    ManualCreateRetailerQBOView,
    RetailerCheckOrder,
    RetailerInventoryXML,
    RetailerSQSInventoryXMLView,
    UpdateCreateRetailerQBOView,
    UpdateDeleteRetailerView,
)
from selleraxis.role_user.views import ListCreateRoleUserView, UpdateDeleteRoleUserView
from selleraxis.roles.views import ListCreateRoleView, UpdateDeleteRoleView
from selleraxis.services.views import ListServiceView
from selleraxis.shipments.views import CancelShipmentView
from selleraxis.shipping_ref.views import ListShippingRefView
from selleraxis.shipping_ref_type.views import (
    ListCreateShippingRefTypeView,
    UpdateDeleteShippingRefTypeView,
)
from selleraxis.shipping_service_types.views import ListShippingServiceTypeView
from selleraxis.users.views import (
    ChangePasswordView,
    GetUpdateMyProfileAPIView,
    PasswordResetView,
    RegistrationAPIView,
    ResetPasswordView,
)

schema_view = get_schema_view(
    openapi.Info(
        title="SellerAxis API",
        default_version="v1",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    url=settings.HOST + "api/",
    public=True,
    permission_classes=[permissions.AllowAny],
    generator_class=CustomerGeneratorSchema,
)

urlpatterns = [
    # docs
    re_path(
        r"^docs/$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    # health
    path("api/health", lambda request: HttpResponse("OK")),
    # auth
    path("admin/", admin.site.urls),
    path("api/auth/register", RegistrationAPIView.as_view(), name="register"),
    path("api/auth/login", TokenObtainPairView.as_view(), name="login"),
    path("api/auth/refresh-token", TokenRefreshView.as_view(), name="refresh_token"),
    path("api/change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("api/password/reset/", PasswordResetView.as_view(), name="password_reset"),
    path(
        "api/password/new-password/", ResetPasswordView.as_view(), name="new-password"
    ),
    # organizations
    path("api/organizations", ListCreateOrganizationView.as_view()),
    path("api/organizations/<str:id>", UpdateDeleteOrganizationView.as_view()),
    # permissions
    path("api/permissions", ListPermissionView.as_view()),
    # roles
    path("api/roles", ListCreateRoleView.as_view()),
    path("api/roles/<str:id>", UpdateDeleteRoleView.as_view()),
    # role user
    path("api/organizations/<str:org_id>/members", ListCreateRoleUserView.as_view()),
    path(
        "api/organizations/<str:org_id>/members/<str:id>",
        UpdateDeleteRoleUserView.as_view(),
    ),
    # retailers
    path(
        "api/retailers/manual-quickbook/bulk", BulkManualCreateRetailerQBOView.as_view()
    ),
    path(
        "api/retailers/manual-quickbook/<str:id>", ManualCreateRetailerQBOView.as_view()
    ),
    path(
        "api/retailers/<str:id>/sqs-inventory-xml",
        RetailerSQSInventoryXMLView.as_view(),
    ),
    path("api/retailers", ListCreateRetailerView.as_view()),
    path("api/retailers/quickbook", UpdateCreateRetailerQBOView.as_view()),
    path("api/retailers/<str:id>", UpdateDeleteRetailerView.as_view()),
    path("api/retailers/<int:pk>/check-orders", RetailerCheckOrder.as_view()),
    path(
        "api/retailers/<str:id>/purchase-orders/import",
        ImportDataPurchaseOrderView.as_view(),
    ),
    path("api/retailers/<str:id>/inventory-xml", RetailerInventoryXML.as_view()),
    # retailer partners
    path("api/retailer-partners", ListCreateRetailerPartnerView.as_view()),
    path("api/retailer-partners/<str:id>", UpdateDeleteRetailerPartnerView.as_view()),
    # retailer order batchs
    path("api/retailer-order-batchs", ListCreateRetailerOrderBatchView.as_view()),
    path(
        "api/retailer-order-batchs/<str:id>",
        UpdateDeleteRetailerOrderBatchView.as_view(),
    ),
    # retailer participating parties
    path(
        "api/retailer-participating-parties",
        ListCreateRetailerParticipatingPartyView.as_view(),
    ),
    path(
        "api/retailer-participating-parties/<str:id>",
        UpdateDeleteRetailerParticipatingPartyView.as_view(),
    ),
    # retailer person places
    path(
        "api/retailer-person-places",
        ListCreateRetailerPersonPlaceView.as_view(),
    ),
    path(
        "api/retailer-person-places/<str:id>",
        UpdateDeleteRetailerPersonPlaceView.as_view(),
    ),
    # retailer purchase orders
    path(
        "api/retailer-purchase-orders/acknowledge/bypass",
        OrderStatusIsBypassedAcknowledge.as_view(),
    ),
    path(
        "api/retailer-purchase-orders",
        ListCreateRetailerPurchaseOrderView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/search",
        SearchRetailerPurchaseOrderView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/check",
        OrganizationPurchaseOrderCheckView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/import",
        OrganizationPurchaseOrderImportView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/import-by-group-retailers",
        RetailerCommercehubSFTPGetOrderView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/<int:pk>/acknowledge",
        RetailerPurchaseOrderAcknowledgeCreateAPIView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/acknowledge/bulk",
        RetailerPurchaseOrderAcknowledgeBulkCreateAPIView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/<int:pk>/backorder",
        RetailerPurchaseOrderBackorderCreateAPIView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/<int:pk>/shipment-confirmation",
        RetailerPurchaseOrderShipmentConfirmationCreateAPIView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/<int:pk>/shipment-cancel",
        RetailerPurchaseOrderShipmentCancelCreateAPIView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/<int:pk>/address/validate",
        ShipToAddressValidationView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/address/validate/bulk",
        ShipToAddressValidationBulkCreateAPIView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/<int:pk>/ship-from-address",
        ShipFromAddressView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/<int:pk>/ship",
        ShippingView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/ship/bulk",
        ShippingBulkCreateAPIView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/histories", ListGettingOrderHistoryView.as_view()
    ),
    path(
        "api/retailer-purchase-orders/daily-picklist",
        DailyPicklistAPIView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/<str:id>",
        UpdateDeleteRetailerPurchaseOrderView.as_view(),
    ),
    # retailer purchase order notes
    path(
        "api/retailer-purchase-order-notes",
        ListCreateRetailerPurchaseOrderNoteView.as_view(),
    ),
    path(
        "api/retailer-purchase-order-notes/<str:id>",
        UpdateDeleteRetailerPurchaseOrderNoteView.as_view(),
    ),
    # retailer purchase order return notes
    path(
        "api/retailer-purchase-order-return-notes",
        ListCreateRetailerPurchaseOrderReturnNoteView.as_view(),
    ),
    path(
        "api/retailer-purchase-order-return-notes/<str:id>",
        UpdateDeleteRetailerPurchaseOrderReturnNoteView.as_view(),
    ),
    # retailer purchase order return items
    path(
        "api/retailer-purchase-order-return-items",
        ListCreateRetailerPurchaseOrderReturnItemView.as_view(),
    ),
    path(
        "api/retailer-purchase-order-return-items/<str:id>",
        RetrieveRetailerPurchaseOrderReturnItemView.as_view(),
    ),
    # retailer purchase order returns
    path(
        "api/retailer-purchase-order-returns",
        ListCreateRetailerPurchaseOrderReturnView.as_view(),
    ),
    path(
        "api/retailer-purchase-order-returns/<str:id>",
        RetrieveRetailerPurchaseOrderReturnView.as_view(),
    ),
    # retailer purchase order items
    path(
        "api/retailer-purchase-order-items",
        ListCreateRetailerPurchaseOrderItemView.as_view(),
    ),
    path(
        "api/retailer-purchase-order-items/<str:id>",
        UpdateDeleteRetailerPurchaseOrderItemView.as_view(),
    ),
    # barcode sizes
    path(
        "api/barcode-sizes",
        ListCreateBarcodeSizeView.as_view(),
    ),
    path(
        "api/barcode-sizes/bulk",
        BulkBarcodeSizeView.as_view(),
    ),
    path(
        "api/barcode-sizes/<str:id>",
        UpdateDeleteBarcodeSizeView.as_view(),
    ),
    # files
    path("api/files/presigned-url", GetUploadPresignedURLView.as_view()),
    path(
        "api/package-rules",
        ListCreatePackageRuleView.as_view(),
    ),
    path(
        "api/package-rules/<str:id>",
        UpdateDeletePackageRuleView.as_view(),
    ),
    # products
    path(
        "api/products/manual-quickbook/bulk", BulkManualCreateProductQBOView.as_view()
    ),
    path(
        "api/products/manual-quickbook/<str:id>", ManualCreateProductQBOView.as_view()
    ),
    path(
        "api/products",
        ListCreateProductView.as_view(),
    ),
    path(
        "api/products/bulk",
        BulkProductView.as_view(),
    ),
    path(
        "api/products/quickbook",
        UpdateCreateQBOView.as_view(),
    ),
    path(
        "api/products/<str:id>",
        UpdateDeleteProductView.as_view(),
    ),
    # profile
    path(
        "api/users/me",
        GetUpdateMyProfileAPIView.as_view(),
    ),
    # product alias
    path(
        "api/product-aliases/update-inventory-xml",
        ProductAliasInventoryXMLView.as_view(),
    ),
    path(
        "api/product-aliases",
        ListCreateProductAliasView.as_view(),
    ),
    path(
        "api/product-aliases/bulk",
        BulkUpdateProductAliasView.as_view(),
    ),
    path(
        "api/product-aliases/<str:id>",
        UpdateDeleteProductAliasView.as_view(),
    ),
    path(
        "api/product-series",
        ListCreateProductSeriesView.as_view(),
    ),
    path(
        "api/product-series/<int:pk>",
        UpdateDeleteProductSeriesView.as_view(),
    ),
    path(
        "api/product-series/bulk",
        BulkProductSeriesView.as_view(),
    ),
    # retailer_queue_history
    path(
        "api/retailer-queue-history",
        ListRetailerQueueHistoryView.as_view(),
    ),
    path(
        "api/retailer-queue-history/<int:pk>",
        UpdateDeleteRetailerQueueHistoryView.as_view(),
    ),
    # retailer warehouse
    path(
        "api/retailer-warehouses",
        ListCreateRetailerWarehouseView.as_view(),
    ),
    path(
        "api/retailer-warehouses/bulk",
        BulkRetailerWarehouseView.as_view(),
    ),
    path(
        "api/retailer-warehouses/<str:id>",
        UpdateDeleteRetailerWarehouseView.as_view(),
    ),
    # retailer warehouse product
    path(
        "api/retailer-warehouses-products",
        ListCreateRetailerWarehouseProductView.as_view(),
    ),
    path(
        "api/retailer-warehouses-products/<str:id>",
        UpdateDeleteRetailerWarehouseProductView.as_view(),
    ),
    path(
        "api/retailer-suggestion",
        RetailerSuggestionAPIView.as_view(),
    ),
    # retailer commercehub sftp
    path(
        "api/retailer-commercehub-sftps",
        ListCreateRetailerCommercehubSFTPView.as_view(),
    ),
    path(
        "api/retailer-commercehub-sftps/<str:id>",
        UpdateDeleteRetailerCommercehubSFTPView.as_view(),
    ),
    # product warehouse static data
    path(
        "api/product-warehouse-static-data/update-inventory",
        GetRetailerToUpdateInventoryView.as_view(),
    ),
    path(
        "api/product-warehouse-static-data",
        ListCreateProductWarehouseStaticDataView.as_view(),
    ),
    path(
        "api/product-warehouse-static-data/bulk",
        BulkUpdateDeleteProductWarehouseStaticDataView.as_view(),
    ),
    path(
        "api/product-warehouse-static-data/<str:id>",
        UpdateDeleteProductWarehouseStaticDataView.as_view(),
    ),
    # service
    path(
        "api/services",
        ListServiceView.as_view(),
    ),
    # retailer carrier
    path(
        "api/retailer-carriers",
        ListCreateRetailerCarrierView.as_view(),
    ),
    path(
        "api/retailer-carriers/bulk",
        BulkRetailerCarrierView.as_view(),
    ),
    path(
        "api/retailer-carriers/<str:id>",
        UpdateDeleteRetailerCarrierView.as_view(),
    ),
    path(
        "api/boxes",
        ListCreateBoxView.as_view(),
    ),
    path(
        "api/boxes/bulk",
        BulkBoxesView.as_view(),
    ),
    path(
        "api/boxes/<str:id>",
        UpdateDeleteBoxView.as_view(),
    ),
    # Shipments
    path(
        "api/shipments/<int:id>/cancel",
        CancelShipmentView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/<int:pk>/package/reset",
        PackageDivideResetView.as_view(),
    ),
    path("api/order_packages/bulk", BulkOrderPackage.as_view()),
    path(
        "api/order_packages",
        ListCreateOrderPackageView.as_view(),
    ),
    path(
        "api/order_packages/<str:id>",
        UpdateDeleteOrderPackageView.as_view(),
    ),
    path(
        "api/order_item_packages",
        ListCreateOrderItemPackageView.as_view(),
    ),
    path(
        "api/order_item_packages/<str:id>",
        UpdateDeleteOrderItemPackageView.as_view(),
    ),
    # retailer shipper
    path(
        "api/retailer-shippers",
        ListCreateRetailerShipperView.as_view(),
    ),
    path(
        "api/retailer-shippers/<str:id>",
        UpdateDeleteRetailerShipperView.as_view(),
    ),
    # QBO
    path(
        "api/qbo-unhandled-data/rehandle",
        SQSSyncUnhandledDataView.as_view(),
    ),
    path(
        "api/invoices/authorization-url",
        GetQBOAuthorizationURLView.as_view(),
    ),
    path(
        "api/invoices/token",
        CreateQBOTokenView.as_view(),
    ),
    path(
        "api/invoices/<int:pk>/xml",
        InvoiceCreateXMLAPIView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/<str:pk>/invoice",
        CreateInvoiceView.as_view(),
    ),
    # shipping_service_type
    path(
        "api/shipping_service_type",
        ListShippingServiceTypeView.as_view(),
    ),
    # shipping ref
    path("api/shipping_ref", ListShippingRefView.as_view()),
    # gs1
    path(
        "api/gs1",
        ListCreateGS1View.as_view(),
    ),
    path(
        "api/gs1/bulk",
        BulkGS1View.as_view(),
    ),
    path(
        "api/gs1/<str:pk>",
        UpdateDeleteGS1View.as_view(),
    ),
    # address
    path("api/address", ListCreateAddressView.as_view()),
    path("api/address/<str:id>", UpdateDeleteAddressView.as_view()),
    # Shipping ref type
    path("api/shipping-ref-type", ListCreateShippingRefTypeView.as_view()),
    path("api/shipping-ref-type/<str:id>", UpdateDeleteShippingRefTypeView.as_view()),
]
