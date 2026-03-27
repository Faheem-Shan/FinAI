from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


class AuthTests(APITestCase):

    def test_register_user(self):
        url = reverse("register")

        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "testpass123"
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)


    def test_login_user(self):

        User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )

        url = reverse("login")

        data = {
            "username": "testuser",
            "password": "testpass123"
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)


    def test_get_profile(self):

        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123"
        )

        login = self.client.post(reverse("login"), {
            "username": "testuser",
            "password": "testpass123"
        })

        token = login.data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

        response = self.client.get(reverse("profile"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "testuser")