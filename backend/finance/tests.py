from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Category, Transaction, Budget
from datetime import date

User = get_user_model()


class FinanceAPITests(APITestCase):

    def setUp(self):

        # create user
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123"
        )

        # login to get token
        response = self.client.post(reverse("login"), {
            "username": "testuser",
            "password": "testpass123"
        })

        token = response.data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_create_category(self):

        url = reverse("categories")

        data = {
            "name": "Food"
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_transaction(self):

        category = Category.objects.create(user=self.user, name="Food")

        url = reverse("transactions")

        data = {
            "amount": 50,
            "type": "expense",
            "description": "Lunch",
            "date": date.today(),
            "category": category.id
        }

        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_dashboard_api(self):

        category = Category.objects.create(user=self.user, name="Salary")

        Transaction.objects.create(
            user=self.user,
            category=category,
            amount=1000,
            type="income",
            description="Salary",
            date=date.today()
        )

        url = reverse("dashboard")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("total_income", response.data)

    def test_ai_insights_api(self):

        url = reverse("insights")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)