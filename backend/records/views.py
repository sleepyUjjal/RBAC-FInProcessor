from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import FinancialRecord, AuditLog
from .serializers import FinancialRecordSerializer, AuditLogSerializer
from accounts.permissions import IsAdminUser

class FinancialRecordViewSet(viewsets.ModelViewSet):
    queryset = FinancialRecord.objects.filter(is_deleted=False).order_by('-date')
    serializer_class = FinancialRecordSerializer
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'category', 'date']
    search_fields = ['description', 'category']
    ordering_fields = ['date', 'amount']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated] 
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = FinancialRecord.objects.filter(is_deleted=False).order_by('-date')
        user = self.request.user

        if not user.is_authenticated:
            return queryset.none()

        if user.role == 'User':
            return queryset.filter(created_by=user)

        if user.role in ['Admin', 'Analyst']:
            return queryset

        return queryset.none()
    
    def perform_create(self, serializer):
        user = self.request.user
        
        if user.role == 'Analyst':
            raise PermissionDenied("Analysts do not have permission to create records.")
            
        instance = serializer.save(created_by=user)
        AuditLog.objects.create(
            user=user, action='CREATE',
            details=f"Created record #{instance.id} - {instance.type} of {instance.amount}"
        )

    def perform_update(self, serializer):
        user = self.request.user
        
        if user.role == 'Analyst':
            raise PermissionDenied("Analysts do not have permission to update records.")
            
        if user.role != 'Admin' and serializer.instance.created_by != user:
            raise PermissionDenied("You can only update your own records.")
            
        instance = serializer.save()
        AuditLog.objects.create(
            user=user, action='UPDATE',
            details=f"Updated record #{instance.id} - {instance.type} of {instance.amount}"
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        if user.role == 'Analyst':
            return Response(
                {"detail": "Analysts do not have permission to delete records."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        log_details = f"record #{instance.id} - {instance.type} of {instance.amount}"

        if user.role == 'Admin':
            AuditLog.objects.create(user=user, action='DELETE', details=f"Hard Deleted {log_details}")
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        if instance.created_by != user:
            return Response({"detail": "You can only delete your own records."}, status=status.HTTP_403_FORBIDDEN)
        
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()
        
        AuditLog.objects.create(user=user, action='UPDATE', details=f"Soft Deleted {log_details}")
        
        return Response(status=status.HTTP_204_NO_CONTENT)

class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['action', 'user']
    search_fields = ['details']
