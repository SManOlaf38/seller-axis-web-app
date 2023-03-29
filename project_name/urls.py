"""project_name URL Configuration

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

from project_name.users.views import RegistrationAPIView

schema_view = get_schema_view(
    openapi.Info(
        title="PROJECT_NAME API",
        default_version="v1",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    url=settings.HOST + "api/",
    public=True,
    permission_classes=[permissions.AllowAny],
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
]
