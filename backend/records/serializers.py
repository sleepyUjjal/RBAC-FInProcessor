from rest_framework import serializers
from .models import FinancialRecord, AuditLog

class FinancialRecordSerializer(serializers.ModelSerializer):
    created_by_email = serializers.EmailField(source='created_by.email', read_only=True)

    class Meta:
        model = FinancialRecord
        fields = '__all__'
        read_only_fields = ('created_by', 'is_deleted', 'deleted_at')

    def validate(self, data):
        category = data.get('category')
        custom_category = data.get('custom_category')

        if category == 'Other' and not custom_category:
            raise serializers.ValidationError({
                "custom_category": "Please provide a category name when 'Other' is selected."
            })
        
        if category != 'Other' and custom_category:
            data['custom_category'] = None

        return data

class AuditLogSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = AuditLog
        fields = '__all__'