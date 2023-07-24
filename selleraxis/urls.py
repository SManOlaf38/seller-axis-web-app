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

from selleraxis.barcode_sizes.views import (
    ListCreateBarcodeSizeView,
    UpdateDeleteBarcodeSizeView,
)
from selleraxis.boxes.views import ListCreateBoxView, UpdateDeleteBoxView
from selleraxis.core.swagger import CustomerGeneratorSchema
from selleraxis.files.views import GetUploadPresignedURLView
from selleraxis.organizations.views import (
    ListCreateOrganizationView,
    OrganizationRetailerCheckOrderView,
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
    UpdateDeleteProductAliasView,
)
from selleraxis.product_series.views import (
    ListCreateProductSeriesView,
    UpdateDeleteProductSeriesView,
)
from selleraxis.product_warehouse_static_data.views import (
    BulkUpdateDeleteProductWarehouseStaticDataView,
    GetRetailerToUpdateInventoryView,
    ListCreateProductWarehouseStaticDataView,
    UpdateDeleteProductWarehouseStaticDataView,
)
from selleraxis.products.views import ListCreateProductView, UpdateDeleteProductView
from selleraxis.retailer_carriers.views import (
    ListCreateRetailerCarrierView,
    UpdateDeleteRetailerCarrierView,
)
from selleraxis.retailer_commercehub_sftp.views import (
    ListCreateRetailerCommercehubSFTPView,
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
from selleraxis.retailer_purchase_orders.views import (
    ListCreateRetailerPurchaseOrderView,
    UpdateDeleteRetailerPurchaseOrderView,
)
from selleraxis.retailer_queue_histories.views import (
    ListRetailerQueueHistoryView,
    UpdateDeleteRetailerQueueHistoryView,
)
from selleraxis.retailer_warehouse_products.views import (
    ListCreateRetailerWarehouseProductView,
    UpdateDeleteRetailerWarehouseProductView,
)
from selleraxis.retailer_warehouses.views import (
    ListCreateRetailerWarehouseView,
    UpdateDeleteRetailerWarehouseView,
)
from selleraxis.retailers.views import (
    ImportDataPurchaseOrderView,
    ListCreateRetailerView,
    RetailerCheckOrder,
    RetailerInventoryXML,
    UpdateDeleteRetailerView,
)
from selleraxis.role_user.views import ListCreateRoleUserView, UpdateDeleteRoleUserView
from selleraxis.roles.views import ListCreateRoleView, UpdateDeleteRoleView
from selleraxis.services.views import ListCreateServiceView, UpdateDeleteServiceView
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
    path(
        "api/organizations/check-orders",
        OrganizationRetailerCheckOrderView.as_view(),
    ),
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
    path("api/retailers", ListCreateRetailerView.as_view()),
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
        "api/retailer-purchase-orders",
        ListCreateRetailerPurchaseOrderView.as_view(),
    ),
    path(
        "api/retailer-purchase-orders/<str:id>",
        UpdateDeleteRetailerPurchaseOrderView.as_view(),
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
        "api/products",
        ListCreateProductView.as_view(),
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
    # product_series
    path(
        "api/product-series",
        ListCreateProductSeriesView.as_view(),
    ),
    path(
        "api/product-series/<int:pk>",
        UpdateDeleteProductSeriesView.as_view(),
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
        ListCreateServiceView.as_view(),
    ),
    path(
        "api/services/<str:id>",
        UpdateDeleteServiceView.as_view(),
    ),
    # retailer carrier
    path(
        "api/retailer-carriers",
        ListCreateRetailerCarrierView.as_view(),
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
        "api/boxes/<str:id>",
        UpdateDeleteBoxView.as_view(),
    ),
]
