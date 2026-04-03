from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model

# Project ke custom user model ko fetch karne ke liye
User = get_user_model()

class AuthAndUserManagementTests(APITestCase):
    def setUp(self):
        # 1. Ek normal user banate hain testing ke liye
        self.normal_user_data = {
            'email': 'user@example.com',
            'password': 'testpassword123',
            # Agar 'username' required field hai aapke model mein, toh yahan add kar dena
        }
        self.normal_user = User.objects.create_user(**self.normal_user_data)

        # 2. Ek Admin (superuser) banate hain User Management API test karne ke liye
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
            # RegisterSerializer mein jo bhi mandatory fields hain, unhe yahan pass karein
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email='newuser@example.com').exists())

    def test_user_login_success(self):
        """Test ki valid credentials ke sath user login kar pa raha hai (JWT token return ho raha hai)."""
        url = reverse('token_obtain_pair')
        data = {
            'email': self.normal_user_data['email'], # Assume kar raha hu email as username use ho raha hai
            'password': self.normal_user_data['password']
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check karte hain ki response body ya cookies mein tokens aaye hain ya nahi
        # (Aapke CustomTokenObtainPairView ke logic ke hisaab se assertion adjust kar lena agar token HttpOnly cookie me hai)
        self.assertTrue('access' in response.data or response.cookies)

    def test_user_profile_authenticated(self):
        """Test ki logged-in user apni profile access kar sakta hai."""
        url = reverse('user_profile')
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.normal_user.email)

    def test_user_profile_unauthenticated(self):
        """Test ki bina login ke koi profile details na dekh paye."""
        url = reverse('user_profile')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_access_user_management(self):
        """Test ki Admin user /users/ list access kar sakta hai."""
        # Router automatically basename-list aur basename-detail URLs banata hai
        url = reverse('user-management-list') 
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_normal_user_cannot_access_user_management(self):
        """Test ki normal user /users/ API ko access na kar paye (RBAC check)."""
        url = reverse('user-management-list')
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.get(url)
        # Agar aapne IsAdminUser permission class lagayi hai, toh yahan 403 aana chahiye
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)