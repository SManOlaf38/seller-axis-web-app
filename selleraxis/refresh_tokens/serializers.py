from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.settings import api_settings

from selleraxis.refresh_tokens.models import (
    RefreshToken,
    RefreshTokenFamily,
    RefreshTokenFamilyStatus,
    RefreshTokenStatus,
)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        token_family = RefreshTokenFamily(user=self.user)
        token_family.save()
        RefreshToken(
            jti=refresh.payload[api_settings.JTI_CLAIM], family=token_family
        ).save()

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        return data


class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        refresh = self.token_class(attrs["refresh"])

        refresh_token_obj = (
            RefreshToken.objects.filter(jti=refresh.payload[api_settings.JTI_CLAIM])
            .select_related("family")
            .first()
        )

        if not refresh_token_obj:
            raise TokenError(_("Refresh token is not found"))

        if refresh_token_obj.status != RefreshTokenStatus.New:
            refresh_token_obj.family.status = RefreshTokenFamilyStatus.Inactive
            refresh_token_obj.family.save()
            raise TokenError(_("Refresh token is inactive"))

        if refresh_token_obj.family.status != RefreshTokenFamilyStatus.Active:
            raise TokenError(_("Refresh token is inactive"))

        data = {"access": str(refresh.access_token)}

        refresh.set_jti()
        refresh.set_exp()
        refresh.set_iat()

        RefreshToken(
            jti=refresh.payload[api_settings.JTI_CLAIM],
            family=refresh_token_obj.family,
            parent=refresh_token_obj,
        ).save()

        refresh_token_obj.status = RefreshTokenStatus.Used
        refresh_token_obj.save()

        data["refresh"] = str(refresh)

        return data
