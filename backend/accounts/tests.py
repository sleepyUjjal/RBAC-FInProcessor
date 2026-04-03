from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

# 
User = get_user_model()

class AuthAndUserManagementTests(APITestCase):
    def setUp(self):
        # Test for normal user creation
        self.normal_user_data = {
            'email': 'user@example.com',
            'password': 'testpassword123',
        }
        self.normal_user = User.objects.create_user(**self.normal_user_data)

        # Test for admin user creation
        self.admin_user = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpassword123'
        )

    def test_user_registration(self):
        """Test ki naya user successfully register ho raha hai ya nahi."""
        url = reverse('auth_register')
        data = {
            'email': 'newuser@example.com',
            'password': 'newpassword123',
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email='newuser@example.com').exists())

    def test_user_login_success(self):
        url = reverse('token_obtain_pair')
        data = {
            'email': self.normal_user_data['email'],
            'password': self.normal_user_data['password']
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        #Check if access token is in response data or cookies
        self.assertTrue('access' in response.data or response.cookies)

    def test_user_profile_authenticated(self):
        url = reverse('user_profile')
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.normal_user.email)

    def test_user_profile_unauthenticated(self):
        url = reverse('user_profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_access_user_management(self):
        url = reverse('user-management-list') 
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_normal_user_cannot_access_user_management(self):
        """Test ki normal user /users/ API ko access na kar paye (RBAC check)."""
        url = reverse('user-management-list')
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)