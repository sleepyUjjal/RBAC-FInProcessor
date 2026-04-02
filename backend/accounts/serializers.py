from rest_framework import serializers
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
        # Only 'Viewer' and 'User' roles can be registered via this endpoint.
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