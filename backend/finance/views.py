import csv
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta

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
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TransactionSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# BUDGET API
class BudgetView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        budgets = Budget.objects.filter(user=request.user)
        serializer = BudgetSerializer(budgets, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BudgetSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class DashboardSummaryAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user
        transactions = Transaction.objects.filter(user=user)

        total_income = transactions.filter(type="income").aggregate(Sum("amount"))["amount__sum"] or 0
        total_expense = transactions.filter(type="expense").aggregate(Sum("amount"))["amount__sum"] or 0
        total_savings = total_income - total_expense

        return Response({
            "total_income": total_income,
            "total_expense": total_expense,
            "total_savings": total_savings
        })
    
class ExportTransactionsCSV(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="transactions.csv"'

        writer = csv.writer(response)
        writer.writerow(["Date", "Description", "Amount", "Type", "Category"])

        transactions = Transaction.objects.filter(user=request.user).select_related("category")

        for t in transactions:
            writer.writerow([t.date, t.description, t.amount, t.type, t.category.name if t.category else ""])

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