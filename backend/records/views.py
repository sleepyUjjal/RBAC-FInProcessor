from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import FinancialRecord, AuditLog
from .serializers import FinancialRecordSerializer
from accounts.permissions import IsAdminUser, IsAnalystUser, IsViewerUser

class FinancialRecordViewSet(viewsets.ModelViewSet):
    queryset = FinancialRecord.objects.all().order_by('-date')
    serializer_class = FinancialRecordSerializer
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'category', 'date']
    search_fields = ['description', 'category']
    ordering_fields = ['date', 'amount']

    def get_permissions(self):
        # RBAC Logic
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAdminUser | IsAnalystUser | IsViewerUser]
        elif self.action in ['create', 'update', 'partial_update']:
            permission_classes = [IsAdminUser | IsAnalystUser]
        elif self.action == 'destroy':
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAdminUser]
            
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        # Automatically set the created_by field to the current user when creating a new record
        serializer.save(created_by=self.request.user)

    def perform_create(self, serializer):
        instance = serializer.save(created_by=self.request.user)
        AuditLog.objects.create(
            user=self.request.user, action='CREATE',
            details=f"Created record #{instance.id} - {instance.type} of {instance.amount}"
        )

    def perform_update(self, serializer):
        instance = serializer.save()
        AuditLog.objects.create(
            user=self.request.user, action='UPDATE',
            details=f"Updated record #{instance.id} - {instance.type} of {instance.amount}"
        )

    def perform_destroy(self, instance):
        AuditLog.objects.create(
            user=self.request.user, action='DELETE',
            details=f"Deleted record #{instance.id} - {instance.type} of {instance.amount}"
        )
        instance.delete()