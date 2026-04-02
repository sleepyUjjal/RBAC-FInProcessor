from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings
from .serializers import RegisterSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
# For Swagger Documentation
from drf_spectacular.utils import extend_schema, inline_serializer
from rest_framework import serializers

User = get_user_model()

# Registration View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

# Login View (JWT + HttpOnly Cookie)
class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            refresh_token = response.data['refresh']
            
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
                httponly=True,
                samesite='Lax', 
                secure=not settings.DEBUG, # Set True in production for HTTPS
            )
            
            # Remove refresh token from response body for security
            del response.data['refresh']
            
        return response

# Logout View (To clear the refresh token cookie)
class LogoutView(APIView):
    @extend_schema(
        description="Logout user and clear HttpOnly refresh token cookie.",
        responses={
            200: inline_serializer(
                name='LogoutResponse',
                fields={
                    'message': serializers.CharField(default="Successfully logged out")
                }
            )
        }
    )
    def post(self, request):
        response = Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
        response.delete_cookie('refresh_token')
        return response
    
# User Profile View
class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(description="Get current logged-in user details using the Authorization Token.")
    def get_object(self):
        return self.request.user