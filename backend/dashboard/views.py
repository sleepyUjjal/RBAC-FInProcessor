from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum
from django.db.models.functions import Coalesce

# Swagger Documentation ke liye imports
from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from records.models import FinancialRecord
from accounts.permissions import IsAdminUser, IsAnalystUser, IsViewerUser

class DashboardSummaryView(APIView):
    permission_classes = [IsAdminUser | IsAnalystUser | IsViewerUser]

    def get_time_threshold(self, period):
        now = timezone.now()
        if period == '1h':
            return now - timedelta(hours=1)
        elif period == '1d':
            return now - timedelta(days=1)
        elif period == '1w':
            return now - timedelta(weeks=1)
        elif period == '1m':
            return now - timedelta(days=30)
        elif period == '1y':
            return now - timedelta(days=365)
        elif period == '5y':
            return now - timedelta(days=365 * 5)
        return None  

    def get_summary_by_type(self, record_type, period):
        threshold = self.get_time_threshold(period)
        queryset = FinancialRecord.objects.filter(type=record_type)

        if threshold:
            if period in ['1h', '1d']:
                queryset = queryset.filter(created_at__gte=threshold)
            else:
                queryset = queryset.filter(date__gte=threshold.date())

        total = queryset.aggregate(total=Coalesce(Sum('amount'), 0.0))['total']
        
        categories = queryset.values('category').annotate(
            amount=Sum('amount')
        ).order_by('-amount')

        return {
            "total": total,
            "period": period,
            "categories": categories
        }

    # ==========================================
    # Swagger (drf-spectacular) Configuration
    # ==========================================
    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='income_range', 
                description='Filter Income (e.g., 1h, 1d, 1w, 1m, 1y, 5y, all)', 
                required=False, 
                type=OpenApiTypes.STR
            ),
            OpenApiParameter(
                name='expense_range', 
                description='Filter Expense (e.g., 1h, 1d, 1w, 1m, 1y, 5y, all)', 
                required=False, 
                type=OpenApiTypes.STR
            ),
            OpenApiParameter(
                name='investment_range', 
                description='Filter Investment (e.g., 1h, 1d, 1w, 1m, 1y, 5y, all)', 
                required=False, 
                type=OpenApiTypes.STR
            ),
        ]
    )
    def get(self, request):
        income_p = request.query_params.get('income_range', 'all')
        expense_p = request.query_params.get('expense_range', 'all')
        investment_p = request.query_params.get('investment_range', 'all')

        income_data = self.get_summary_by_type('Income', income_p)
        expense_data = self.get_summary_by_type('Expense', expense_p)
        investment_data = self.get_summary_by_type('Investment', investment_p)

        net_balance = income_data['total'] - expense_data['total']

        return Response({
            "net_balance": net_balance,
            "income": income_data,
            "expense": expense_data,
            "investment": investment_data,
            "server_time": timezone.now()
        })