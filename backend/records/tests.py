from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from .models import FinancialRecord, AuditLog
from django.utils import timezone

User = get_user_model()

class RecordsAPITests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_user(
            email='admin@records.com', password='testpassword123', role='Admin'
        )
        self.viewer_user = User.objects.create_user(
            email='viewer@records.com', password='testpassword123', role='Viewer'
        )
        self.normal_user = User.objects.create_user(
            email='user@records.com', password='testpassword123', role='User'
        )

        self.today = timezone.now().date().isoformat()

        self.test_record = FinancialRecord.objects.create(
            amount=500, type='Income', category='Salary', date=self.today, created_by=self.normal_user
        )

    def test_viewer_cannot_create_or_delete_record(self):
        self.client.force_authenticate(user=self.viewer_user)
        
        data = {"amount": 5000, "type": "Income", "category": "Salary", "date": self.today}
        response_create = self.client.post('/api/records/data/', data)
        self.assertEqual(response_create.status_code, status.HTTP_403_FORBIDDEN)

        response_delete = self.client.delete(f'/api/records/data/{self.test_record.id}/')
        self.assertEqual(response_delete.status_code, status.HTTP_403_FORBIDDEN)

    def test_custom_validation_for_other_category(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {
            "amount": 1000,
            "type": "Expense",
            "category": "Other",
            "custom_category": "",
            "date": self.today 
        }
        response = self.client.post('/api/records/data/', data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('custom_category', response.data)

    def test_audit_log_automation(self):
        self.client.force_authenticate(user=self.admin_user)
        data = {"amount": 2000, "type": "Income", "category": "Salary", "date": self.today}
        
        self.assertEqual(AuditLog.objects.count(), 0)
        
        response = self.client.post('/api/records/data/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        self.assertEqual(AuditLog.objects.count(), 1)
        log = AuditLog.objects.first()
        self.assertEqual(log.action, 'CREATE')
        self.assertEqual(log.user, self.admin_user)

    def test_normal_user_soft_deletes(self):
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.delete(f'/api/records/data/{self.test_record.id}/')
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        self.test_record.refresh_from_db()
        self.assertTrue(self.test_record.is_deleted)
        self.assertIsNotNone(self.test_record.deleted_at)

    def test_admin_user_hard_deletes(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(f'/api/records/data/{self.test_record.id}/')
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        record_exists = FinancialRecord.objects.filter(id=self.test_record.id).exists()
        self.assertFalse(record_exists)