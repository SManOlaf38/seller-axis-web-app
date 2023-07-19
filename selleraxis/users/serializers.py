from rest_framework import exceptions, serializers

from selleraxis.users.models import User


class RegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=50, min_length=6)
    password = serializers.CharField(max_length=150, write_only=True)

    class Meta:
        model = User
        fields = ("id", "first_name", "last_name", "email", "password")

    def validate_email(self, value):
        lower_email = value.lower()
        if User.objects.filter(email__iexact=lower_email).exists():
            raise exceptions.ParseError("email already exists")
        return lower_email

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "email", "phone", "avatar"]
        extra_kwargs = {
            "id": {"read_only": True},
            "email": {"read_only": True},
        }


class ChangePasswordSerializer(serializers.Serializer):
    model = User

    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        lower_email = value.lower()
        user = User.objects.filter(email__iexact=lower_email).exists()
        if not user:
            raise exceptions.ParseError("User with this email address does not exist!")
        return lower_email


class ResetPasswordSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    secret = serializers.CharField()
    password = serializers.CharField()
