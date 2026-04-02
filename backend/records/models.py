from django.db import models
from django.conf import settings

class FinancialRecord(models.Model):
    TYPE_CHOICES = (
        ('Income', 'Income'),
        ('Expense', 'Expense'),
        ('Investment', 'Investment'),
    )

    CATEGORY_CHOICES = (
        ('Food', 'Food & Dining'),
        ('Travel', 'Travel & Transport'),
        ('Rent', 'Rent & Accommodation'),
        ('Salary', 'Salary/Active Income'),
        ('Utilities', 'Bills & Utilities'),
        ('Entertainment', 'Entertainment'),
        ('Health', 'Medical & Health'),
        ('Shopping', 'Shopping'),
        ('Education', 'Education'),
        ('Investment', 'Investment Returns'),
        ('Other', 'Other'), 
    )

    amount = models.DecimalField(max_digits=15, decimal_places=2)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Other')
    
    # Naya field 'Other' category ke liye
    custom_category = models.CharField(max_length=100, blank=True, null=True)
    
    description = models.TextField(blank=True, null=True)
    date = models.DateField()
    
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        cat_name = self.custom_category if self.category == 'Other' else self.category
        return f"{self.type} - {self.amount} ({cat_name})"


class AuditLog(models.Model):
    ACTION_CHOICES = (
        ('CREATE', 'Create'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    module = models.CharField(max_length=50, default='Financial Record')
    details = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.action} on {self.timestamp}"