from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.contrib.auth.tokens import default_token_generator
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.users.models import User
from selleraxis.users.serializers import (
    ChangePasswordSerializer,
    PasswordResetSerializer,
    RegistrationSerializer,
    ResetPasswordSerializer,
    UserSerializer,
)


class RegistrationAPIView(generics.GenericAPIView):
    serializer_class = RegistrationSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"Message": "User created successfully", "User": serializer.data},
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetUpdateMyProfileAPIView(RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(id=self.request.user.id)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset)
        return obj


class ChangePasswordView(generics.UpdateAPIView):
    """
    An endpoint for changing password.
    """

    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = [IsAuthenticated]

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response(
                    {"old_password": ["Wrong password."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            response = {
                "status": "success",
                "code": status.HTTP_200_OK,
                "message": "Password updated successfully",
                "data": [],
            }

            return Response(response)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(generics.GenericAPIView):
    serializer_class = PasswordResetSerializer

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data.get("email")
            user = get_object_or_404(User, email=email)
            # Generate a password reset token
            token = default_token_generator.make_token(user)
            reset_link = f"{settings.WEBSITE_URL}/auth/reset-password/?user={user.id}&secret={token}"
            settings.SES_CLIENT.send_templated_email(
                Source=settings.SENDER_EMAIL,
                Destination={"ToAddresses": [email]},
                Template="reset_password",
                TemplateData=f'{{"verification_link": "{reset_link}"}}',
            )

            return Response({"detail": "Password reset email sent!"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(generics.GenericAPIView):
    serializer_class = ResetPasswordSerializer

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        id = serializer.validated_data["id"]
        secret = serializer.validated_data["secret"]
        password = serializer.validated_data["password"]
        user = get_object_or_404(User, id=id)
        if not default_token_generator.check_token(user, secret):
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )
        user.password = make_password(password)
        user.save()
        return Response(
            {"message": "Password reset successful"}, status=status.HTTP_200_OK
        )
