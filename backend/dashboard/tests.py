from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from records.models import FinancialRecord
from django.utils import timezone

User = get_user_model()

class DashboardAPITests(APITestCase):
    def setUp(self):
        self.analyst_user = User.objects.create_user(
            email='analyst@dashboard.com', password='testpassword123', role='Analyst'
        )
        
        today = timezone.now().date()

        FinancialRecord.objects.create(
            amount=10000, type='Income', category='Salary', 
            date=today, created_by=self.analyst_user
        )
        FinancialRecord.objects.create(
            amount=3000, type='Expense', category='Food', 
            date=today, created_by=self.analyst_user
        )

    def test_dashboard_summary_structure(self):
        self.client.force_authenticate(user=self.analyst_user)
        response = self.client.get('/api/dashboard/summary/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('net_balance', response.data)
        self.assertIn('income', response.data)
        self.assertIn('expense', response.data)
        
        # Mathematical logic test (Income 10k - Expense 3k = 7k Net Balance)
        self.assertEqual(response.data['net_balance'], 7000.00)