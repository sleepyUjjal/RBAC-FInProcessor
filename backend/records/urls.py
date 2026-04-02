from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FinancialRecordViewSet, AuditLogViewSet

router = DefaultRouter()
router.register(r'data', FinancialRecordViewSet, basename='financial-record')
router.register(r'logs', AuditLogViewSet, basename='audit-logs')

urlpatterns = [
    path('', include(router.urls)),
]