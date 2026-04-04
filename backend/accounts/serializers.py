from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'role')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'first_name', 'last_name', 'role')

    def create(self, validated_data):
        role = validated_data.get('role', 'User')
        
        # RBAC Security Check:
        # No registration allowed for 'Admin' and 'Analyst' roles through public API.
        if role in ['Admin', 'Analyst']:
            raise serializers.ValidationError(
                {"role": f"Registration as {role} is restricted. Please contact the system administrator."}
            )
        
        # Create user with validated data
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=role
        )
        return user
    
class UserManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'role', 'is_active', 'date_joined')
        read_only_fields = ('id', 'email', 'first_name', 'last_name', 'date_joined')

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get(self.username_field)
        password = attrs.get("password")

        if email and password:
            try:
                user = User.objects.get(**{self.username_field: email})
            except User.DoesNotExist:
                raise AuthenticationFailed({"detail": "User does not exist with this email."})

            if not user.check_password(password):
                raise AuthenticationFailed({"detail": "Invalid password."})
                
            if not user.is_active:
                raise AuthenticationFailed({"detail": "User account is disabled."})

        return super().validate(attrs)