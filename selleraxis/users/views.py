from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from selleraxis.users.models import User
from selleraxis.users.serializers import RegistrationSerializer, UserSerializer


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

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, email=self.request.user.email)
        return obj
