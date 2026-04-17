from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from datetime import date

from finance.models import Category, Transaction, Budget
from tenants.models import Company, CompanyUser

User = get_user_model()


class FinanceAPITests(APITestCase):

    def setUp(self):
        # Create user
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123",
            email="testuser@gmail.com"
        )

        # Login
        response = self.client.post(reverse("login"), {
            "username": "testuser",
            "password": "testpass123"
        })

        self.token = response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    # ======================================
    # ✅ CATEGORY TEST
    # ======================================
    def test_create_category(self):
        url = reverse("categories")

        response = self.client.post(url, {
            "name": "Food",
            "type": "expense"
        })

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # ======================================
    # ✅ PERSONAL TRANSACTION TEST
    # ======================================
    def test_create_transaction_personal(self):

        category = Category.objects.create(
            user=self.user,
            name="Food",
            type="expense"
        )

        url = reverse("transactions")

        response = self.client.post(url, {
            "amount": 100,
            "type": "expense",
            "description": "Lunch",
            "date": date.today(),
            "category": category.id
        })

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], "approved")

    # ======================================
    # ✅ COMPANY ACCOUNTANT → PENDING
    # ======================================
    def test_company_transaction_pending(self):

        company = Company.objects.create(name="TCS", domain="tcs.com")

        self.user.company = company
        self.user.save()

        CompanyUser.objects.create(
            company=company,
            email=self.user.email,
            role="accountant"
        )

        category = Category.objects.create(
            company=company,
            name="Food",
            type="expense"
        )

        url = reverse("transactions")

        response = self.client.post(url, {
            "amount": 200,
            "type": "expense",
            "description": "Lunch",
            "date": date.today(),
            "category": category.id
        })

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["status"], "pending")

    # ======================================
    # ✅ MANAGER APPROVES TRANSACTION
    # ======================================
    def test_manager_approves_transaction(self):

        company = Company.objects.create(name="TCS", domain="tcs.com")

        self.user.company = company
        self.user.save()

        CompanyUser.objects.create(
            company=company,
            email=self.user.email,
            role="manager"
        )

        category = Category.objects.create(
            company=company,
            name="Food",
            type="expense"
        )

        transaction = Transaction.objects.create(
            user=self.user,
            company=company,
            category=category,
            amount=300,
            type="expense",
            date=date.today(),
            status="pending"
        )

        url = reverse("approve-transaction", args=[transaction.id])

        response = self.client.post(url, {"action": "approve"})

        self.assertEqual(response.status_code, 200)

        transaction.refresh_from_db()
        self.assertEqual(transaction.status, "approved")

    # ======================================
    # ✅ DASHBOARD ONLY APPROVED
    # ======================================
    def test_dashboard_only_approved(self):

        company = Company.objects.create(name="TCS", domain="tcs.com")

        self.user.company = company
        self.user.save()

        category = Category.objects.create(
            company=company,
            name="Food",
            type="expense"
        )

        # Pending transaction
        Transaction.objects.create(
            user=self.user,
            company=company,
            category=category,
            amount=500,
            type="expense",
            date=date.today(),
            status="pending"
        )

        url = reverse("dashboard")
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["total_expense"], 0)

    # ======================================
    # ✅ SECURITY TEST (CROSS COMPANY BLOCK)
    # ======================================
    def test_cross_company_category_block(self):

        company1 = Company.objects.create(name="TCS", domain="tcs.com")
        company2 = Company.objects.create(name="Infosys", domain="infosys.com")

        self.user.company = company1
        self.user.save()

        category = Category.objects.create(
            company=company2,
            name="Food",
            type="expense"
        )

        url = reverse("transactions")

        response = self.client.post(url, {
            "amount": 100,
            "type": "expense",
            "description": "Invalid",
            "date": date.today(),
            "category": category.id
        })

        self.assertEqual(response.status_code, 400)

    # ======================================
    # ✅ EXPORT CSV TEST
    # ======================================
    def test_export_csv(self):

        category = Category.objects.create(
            user=self.user,
            name="Food",
            type="expense"
        )

        Transaction.objects.create(
            user=self.user,
            category=category,
            amount=100,
            type="expense",
            date=date.today()
        )

        url = reverse("export")

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "text/csv")

    # ======================================
    # ✅ AI INSIGHTS TEST
    # ======================================
    def test_ai_insights(self):

        url = reverse("insights")

        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.data, list)