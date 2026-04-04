from collections import defaultdict
from datetime import timedelta
from decimal import Decimal

from django.db.models import DecimalField, Sum, Value
from django.db.models.functions import Coalesce
from django.utils import timezone
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema, inline_serializer
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework.permissions import IsAuthenticated
from records.models import FinancialRecord

DashboardTypeSummarySerializer = inline_serializer(
    name='DashboardTypeSummary',
    fields={
        'total': serializers.DecimalField(max_digits=15, decimal_places=2),
        'period': serializers.CharField(),
        'categories': serializers.ListField(child=serializers.DictField()),
        'timeline': serializers.ListField(child=serializers.DictField()),
    },
)

DashboardSummaryResponseSerializer = inline_serializer(
    name='DashboardSummaryResponse',
    fields={
        'net_balance': serializers.DecimalField(max_digits=15, decimal_places=2),
        'income': DashboardTypeSummarySerializer,
        'expense': DashboardTypeSummarySerializer,
        'investment': DashboardTypeSummarySerializer,
        'server_time': serializers.DateTimeField(),
    },
)


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get_time_threshold(self, period):
        now = timezone.now()
        if period == '1h':
            return now - timedelta(hours=1)
        if period == '1d':
            return now - timedelta(days=1)
        if period == '1w':
            return now - timedelta(weeks=1)
        if period == '1m':
            return now - timedelta(days=30)
        if period == '1y':
            return now - timedelta(days=365)
        if period == '5y':
            return now - timedelta(days=365 * 5)
        return None

    def get_filtered_queryset(self, record_type, period):
        threshold = self.get_time_threshold(period)
        queryset = FinancialRecord.objects.filter(type=record_type, is_deleted=False)
        
        user = self.request.user
        if user.role == 'User':
            queryset = queryset.filter(created_by=user)
        elif user.role in ['Admin', 'Analyst']:
            target_user_id = self.request.query_params.get('user_id')
            if target_user_id:
                queryset = queryset.filter(created_by_id=target_user_id)

        if threshold:
            if period in ['1h', '1d']:
                queryset = queryset.filter(created_at__gte=threshold)
            else:
                queryset = queryset.filter(date__gte=threshold.date())

        return queryset

    def get_timeline_bucket(self, record, period):
        if period == '1h':
            point = timezone.localtime(record.created_at).replace(minute=0, second=0, microsecond=0)
            return point.isoformat(), point.strftime('%H:%M')

        if period == '1d':
            point = timezone.localtime(record.created_at).replace(minute=0, second=0, microsecond=0)
            return point.isoformat(), point.strftime('%d %b %H:%M')

        if period in ['1w', '1m']:
            point = record.date
            return point.isoformat(), point.strftime('%d %b')

        if period == '1y':
            point = record.date.replace(day=1)
            return point.isoformat(), point.strftime('%b %Y')

        point = record.date.replace(month=1, day=1)
        return point.isoformat(), point.strftime('%Y')

    def get_timeline_by_type(self, queryset, period):
        timeline_map = defaultdict(lambda: {"bucket": "", "label": "", "amount": Decimal("0")})

        for record in queryset.only('amount', 'date', 'created_at'):
            bucket, label = self.get_timeline_bucket(record, period)
            timeline_map[bucket]["bucket"] = bucket
            timeline_map[bucket]["label"] = label
            timeline_map[bucket]["amount"] += record.amount or Decimal("0")

        ordered_keys = sorted(timeline_map.keys())
        return [timeline_map[key] for key in ordered_keys]

    def get_summary_by_type(self, record_type, period):
        queryset = self.get_filtered_queryset(record_type, period)

        total = queryset.aggregate(
            total=Coalesce(
                Sum('amount'),
                Value(0, output_field=DecimalField()),
                output_field=DecimalField(),
            )
        )['total']

        categories = queryset.values('category').annotate(amount=Sum('amount')).order_by('-amount')

        return {
            "total": total,
            "period": period,
            "categories": categories,
            "timeline": self.get_timeline_by_type(queryset, period),
        }

    @extend_schema(
        request=None,
        responses={200: DashboardSummaryResponseSerializer},
        parameters=[
            OpenApiParameter(
                name='income_range',
                description='Filter Income (e.g., 1h, 1d, 1w, 1m, 1y, 5y, all)',
                required=False,
                type=OpenApiTypes.STR,
            ),
            OpenApiParameter(
                name='expense_range',
                description='Filter Expense (e.g., 1h, 1d, 1w, 1m, 1y, 5y, all)',
                required=False,
                type=OpenApiTypes.STR,
            ),
            OpenApiParameter(
                name='investment_range',
                description='Filter Investment (e.g., 1h, 1d, 1w, 1m, 1y, 5y, all)',
                required=False,
                type=OpenApiTypes.STR,
            ),
            OpenApiParameter(
                name='user_id',
                description='Filter by specific user ID (Admin/Analyst only)',
                required=False,
                type=OpenApiTypes.INT,
            ),
        ],
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
            "server_time": timezone.now(),
        })
