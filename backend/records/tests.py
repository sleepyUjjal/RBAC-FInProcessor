from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from .models import FinancialRecord, AuditLog
from django.utils import timezone # Date handle karne ke liye add kiya

User = get_user_model()

class RecordsAPITests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_user(
            email='admin@records.com', password='testpassword123', role='Admin'
        )
        self.viewer_user = User.objects.create_user(
            email='viewer@records.com', password='testpassword123', role='Viewer'
        )
        # Aaj ki date setup kar li
        self.today = timezone.now().date().isoformat()

    def test_viewer_cannot_create_record(self):
        """Test ki Viewer user naya record create nahi kar sakta."""
        self.client.force_authenticate(user=self.viewer_user)
        # Data mein date add kiya
        data = {"amount": 5000, "type": "Income", "category": "Salary", "date": self.today}
        response = self.client.post('/api/records/data/', data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_custom_validation_for_other_category(self):
        """Test ki agar category 'Other' hai bina custom_category ke, toh fail hona chahiye."""
        self.client.force_authenticate(user=self.admin_user)
        data = {
            "amount": 1000,
            "type": "Expense",
            "category": "Other",
            "custom_category": "", # Khali chhod diya jaan boojh kar
            "date": self.today # Yahan bhi date add kiya
        }
        response = self.client.post('/api/records/data/', data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('custom_category', response.data) # Error message aana chahiye

    def test_audit_log_automation(self):
        """Test ki Admin ke record create karne par AuditLog automatically ban raha hai."""
        self.client.force_authenticate(user=self.admin_user)
        # Yahan bhi date add kiya
        data = {"amount": 2000, "type": "Income", "category": "Salary", "date": self.today}
        
        # Ensure pehle koi log nahi hai
        self.assertEqual(AuditLog.objects.count(), 0)
        
        # Record banaya
        response = self.client.post('/api/records/data/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Check audit log ban gaya
        self.assertEqual(AuditLog.objects.count(), 1)
        log = AuditLog.objects.first()
        self.assertEqual(log.action, 'CREATE')
        self.assertEqual(log.user, self.admin_user)