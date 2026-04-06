import csv
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from django.db.models.functions import TruncMonth
from django.db.models import Q
from decimal import Decimal

from finance.tasks import send_transaction_email 
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer


# CATEGORY API
class CategoryView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        categories = Category.objects.filter(user=request.user)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# TRANSACTION API
class TransactionView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user).order_by("-date")

        search = request.GET.get("search")
        t_type = request.GET.get("type")
        category = request.GET.get("category")

        if search:
            transactions = transactions.filter(
                Q(description__icontains=search) |
                Q(category__name__icontains=search)
            )

        if t_type:
            transactions = transactions.filter(type=t_type)

        if category:
            transactions = transactions.filter(category_id=category)

        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

  
    def post(self, request):
        serializer = TransactionSerializer(data=request.data)

        if serializer.is_valid():
            transaction = serializer.save(user=request.user)

            user = request.user
            amount = transaction.amount
            t_type = transaction.type
            category = transaction.category
            now = timezone.now()

            # ============================
            # 💰 INCOME
            # ============================
            if t_type == "income":
                self.send_income_email(user, amount, category)

            # ============================
            # 💸 EXPENSE
            # ============================
            elif t_type == "expense":
                self.send_expense_email(user, amount, category)
                self.handle_budget_alert(user, category, now)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    def delete(self, request, pk):
        try:
            transaction = Transaction.objects.get(id=pk, user=request.user)
            transaction.delete()
            return Response({"message": "Transaction deleted successfully"}, status=200)

        except Transaction.DoesNotExist:
            return Response({"error": "Transaction not found"}, status=404)

    # ============================
    # 📩 EMAIL FUNCTIONS
    # ============================
    def send_income_email(self, user, amount, category):
        message = f"""Hi {user.username},

Income credited successfully 💰

Amount: ₹{amount}
Category: {category.name if category else "General"}

Keep growing your savings 🚀

- Team FinAI
"""
        send_transaction_email.delay(user.email, message, "Income Credited 💰")

    def send_expense_email(self, user, amount, category):
        message = f"""Hi {user.username},

Expense recorded 💸

Amount: ₹{amount}
Category: {category.name if category else "General"}

Stay within your budget ⚠️

- Team FinAI
""".strip()
        
        send_transaction_email.delay(user.email, message, "Expense Debited 💸")

    # ============================
    # ⚠️ BUDGET ALERT LOGIC
    # ============================
    def handle_budget_alert(self, user, category, now):

        budget = Budget.objects.filter(
            user=user,
            category=category,
            month=now.month,
            year=now.year
        ).first()

        if not budget:
            return

        total_expense = Transaction.objects.filter(
            user=user,
            type="expense",
            category=category,
            date__month=now.month,
            date__year=now.year
        ).aggregate(Sum("amount"))["amount__sum"] or 0

        if not budget.alert_80_sent and total_expense >= budget.amount * Decimal("0.8"):
            message = f"""⚠️ Budget Alert!

Category: {category.name}
Used: ₹{total_expense}
Budget: ₹{budget.amount}

You have used 80% of your budget.
"""
            send_transaction_email.delay(user.email, message, "Budget Warning ⚠️")

            budget.alert_80_sent = True
            budget.save()

      
        if not budget.alert_100_sent and total_expense >= budget.amount:
            message = f"""🚨 Budget Exceeded!

Category: {category.name}
Spent: ₹{total_expense}
Budget: ₹{budget.amount}

You have exceeded your budget!
"""
            send_transaction_email.delay(user.email, message, "Budget Exceeded 🚨")

            budget.alert_100_sent = True
            budget.save()


# BUDGET API
class BudgetView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        now = timezone.now()

        budgets = Budget.objects.filter(
            user=request.user,
            month=now.month,
            year=now.year
        )

        serializer = BudgetSerializer(budgets, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BudgetSerializer(data=request.data)

        if serializer.is_valid():

            now = timezone.now()
            category = serializer.validated_data.get("category")

            existing_budget = Budget.objects.filter(
                user=request.user,
                category=category,
                month=now.month,
                year=now.year
            ).first()

            if existing_budget:
                return Response(
                    {"error": "Budget already exists for this category this month"},
                    status=400
                )

            budget = serializer.save(
                user=request.user,
                month=now.month,
                year=now.year
            )

            user = request.user
            amount = budget.amount

            message = f"""Hi {user.username},

Your budget has been set successfully 🎯

Category: {category.name}
Amount: ₹{amount}
Month: {now.strftime('%B %Y')}

- Team FinAI
"""

            send_transaction_email.delay(
                user.email,
                message,
                "Budget Created 🎯"
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        try:
            budget = Budget.objects.get(id=pk, user=request.user)
            budget.delete()
            return Response({"message": "Budget deleted successfully"}, status=200)

        except Budget.DoesNotExist:
            return Response({"error": "Budget not found"}, status=404)

class DashboardSummaryAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user
        now = timezone.now()

    
        # ✅ CURRENT MONTH DATA
        
        current_transactions = Transaction.objects.filter(
            user=user,
            date__month=now.month,
            date__year=now.year
        )

        total_income = current_transactions.filter(type="income").aggregate(Sum("amount"))["amount__sum"] or 0
        total_expense = current_transactions.filter(type="expense").aggregate(Sum("amount"))["amount__sum"] or 0
        total_savings = total_income - total_expense

    
        # 📊 LAST 6 MONTHS GRAPH
    
        six_months_ago = now - timedelta(days=180)

        monthly_activity = Transaction.objects.filter(
            user=user,
            date__gte=six_months_ago
        ).annotate(
            month=TruncMonth("date")
        ).values("month", "type").annotate(
            total=Sum("amount")
        ).order_by("month")

        formatted_activity = {}
        for item in monthly_activity:
            month_str = item["month"].strftime("%b %Y")

            if month_str not in formatted_activity:
                formatted_activity[month_str] = {
                    "month": month_str,
                    "income": 0,
                    "expense": 0
                }

            if item["type"] == "income":
                formatted_activity[month_str]["income"] = item["total"]
            else:
                formatted_activity[month_str]["expense"] = item["total"]

        
        # 🍩 CATEGORY (CURRENT MONTH)
    
        spending_by_category = current_transactions.filter(
            type="expense"
        ).values("category__name").annotate(
            amount=Sum("amount")
        )

        return Response({
            "total_income": total_income,
            "total_expense": total_expense,
            "total_savings": total_savings,
            "monthly_activity": list(formatted_activity.values()),
            "spending_by_category": list(spending_by_category)
        })
        
class ExportTransactionsCSV(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        now = timezone.now()

        # ✅ FILTER ONLY CURRENT MONTH
        transactions = Transaction.objects.filter(
            user=request.user,
            date__month=now.month,
            date__year=now.year
        ).select_related("category")

        # ✅ CALCULATE SUMMARY
        total_income = transactions.filter(type="income").aggregate(Sum("amount"))["amount__sum"] or 0
        total_expense = transactions.filter(type="expense").aggregate(Sum("amount"))["amount__sum"] or 0
        total_savings = total_income - total_expense

        # ✅ CREATE RESPONSE
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f'attachment; filename="FinAI_Report_{now.month}_{now.year}.csv"'

        writer = csv.writer(response)

        # ============================
        # 📊 REPORT HEADER
        # ============================
        writer.writerow(["FINAI MONTHLY REPORT"])
        writer.writerow([f"Month: {now.strftime('%B %Y')}"])
        writer.writerow([])

        # ============================
        # 💰 SUMMARY SECTION
        # ============================
        writer.writerow(["SUMMARY"])
        writer.writerow(["Total Income", total_income])
        writer.writerow(["Total Expense", total_expense])
        writer.writerow(["Total Savings", total_savings])
        writer.writerow([])

        # ============================
        # 📋 TRANSACTION TABLE
        # ============================
        writer.writerow(["Date", "Description", "Amount", "Type", "Category"])

        for t in transactions:
            writer.writerow([
                t.date,
                t.description,
                t.amount,
                t.type,
                t.category.name if t.category else "General"
            ])

        return response
    
class AIInsightsAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user
        expenses = Transaction.objects.filter(user=user, type="expense")
        income = Transaction.objects.filter(user=user, type="income").aggregate(Sum("amount"))["amount__sum"] or 0

        insights = []

        if income > 0:
            food_spending = expenses.filter(category__name__icontains="food").aggregate(Sum("amount"))["amount__sum"] or 0
            food_percent = (food_spending / income) * 100

            if food_percent > 30:
                insights.append({
                    "title": "High Food Spending",
                    "description": f"You spent {food_percent:.1f}% of your income on food.",
                    "type": "warning"
                })

        if not insights:
            insights.append({
                "title": "Financial Health OK",
                "description": "Your spending patterns look stable.",
                "type": "success"
            })

        return Response(insights)