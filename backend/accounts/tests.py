from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


class AuthTests(APITestCase):

    # =========================================
    # ✅ REGISTER TEST
    # Checks:
    # - user registration works
    # - user created successfully
    # =========================================
    def test_register_user(self):
        url = reverse("register")

        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123"
        }

        response = self.client.post(url, data)

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED
        )

        self.assertEqual(
            User.objects.count(),
            1
        )

    # =========================================
    # ✅ LOGIN TEST
    #
    # IMPORTANT:
    # Your system uses:
    # email + password login
    #
    # But email is sent inside:
    # "username" field
    #
    # because of CustomTokenObtainPairSerializer
    # =========================================
    def test_login_user(self):

        User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )

        url = reverse("login")

        data = {
            # ✅ use email here
            "username": "test@example.com",
            "password": "testpass123"
        }

        response = self.client.post(url, data)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertIn(
            "access",
            response.data
        )

    # =========================================
    # ✅ GET PROFILE TEST
    #
    # Checks:
    # - JWT authentication works
    # - authenticated user can fetch profile
    # =========================================
    def test_get_profile(self):

        User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )

        # ✅ login using email inside username field
        login = self.client.post(
            reverse("login"),
            {
                "username": "test@example.com",
                "password": "testpass123"
            }
        )

        token = login.data["access"]

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {token}"
        )

        response = self.client.get(
            reverse("profile")
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            response.data["username"],
            "testuser"
        )

    # =========================================
    # ✅ UNAUTHORIZED PROFILE ACCESS TEST
    #
    # Checks:
    # - profile endpoint is protected
    # - without token → 401
    # =========================================
    def test_profile_requires_authentication(self):

        response = self.client.get(
            reverse("profile")
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED
        )