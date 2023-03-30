from rest_framework import serializers

from selleraxis.package_rules.models import PackageRule


class PackageRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageRule
        fields = "__all__"
        extra_kwargs = {
            "id": {"read_only": True},
            "organization": {"read_only": True},
            "created_at": {"read_only": True},
            "updated_at": {"read_only": True},
        }
