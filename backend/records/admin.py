from django.contrib import admin
from .models import FinancialRecord

class FinancialRecordAdmin(admin.ModelAdmin):
    list_display = ('type', 'amount', 'category', 'date', 'created_by')
    list_filter = ('type', 'category', 'date')
    search_fields = ('category', 'description')

admin.site.register(FinancialRecord, FinancialRecordAdmin)