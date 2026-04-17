import csv
import requests
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
from tenants.models import CompanyUser
from finance.tasks import send_transaction_email 
from .models import Category, Transaction, Budget
from .serializers import CategorySerializer, TransactionSerializer, BudgetSerializer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from notifications.models import Notification


# CATEGORY API
class CategoryView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.company:
            categories = Category.objects.filter(company=request.user.company)
        else:
            categories = Category.objects.filter(user=request.user)

        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(
                user=request.user if not request.user.company else None,
                company=request.user.company
            )
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
    

# TRANSACTION API
# class TransactionView(APIView):

#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         transactions = Transaction.objects.filter(user=request.user).order_by("-date")

#         search = request.GET.get("search")
#         t_type = request.GET.get("type")
#         category = request.GET.get("category")

#         if search:
#             transactions = transactions.filter(
#                 Q(description__icontains=search) |
#                 Q(category__name__icontains=search)
#             )

#         if t_type:
#             transactions = transactions.filter(type=t_type)

#         if category:
#             transactions = transactions.filter(category_id=category)

#         serializer = TransactionSerializer(transactions, many=True)
#         return Response(serializer.data)

  
#     def post(self, request):
#         serializer = TransactionSerializer(data=request.data)

#         if serializer.is_valid():
#             transaction = serializer.save(user=request.user)

#             # Capture data for background processing
#             user = request.user
#             amount = transaction.amount
#             t_type = transaction.type
#             category = transaction.category
#             now = timezone.now()

#             # Fix: Run risky/slow logic in background thread to avoid hanging and 500s
#             def run_background_logic():
#                 try:
#                     if t_type == "income":
#                         self.send_income_email(user, amount, category)
#                     elif t_type == "expense":
#                         self.send_expense_email(user, amount, category)
#                         self.handle_budget_alert(user, category, now)
#                 except Exception as e:
#                     print(f"Background Task Error: {e}")

#             import threading
#             threading.Thread(target=run_background_logic).start()

#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
#     def delete(self, request, pk):
#         try:
#             transaction = Transaction.objects.get(id=pk, user=request.user)
#             transaction.delete()
#             return Response({"message": "Transaction deleted successfully"}, status=200)

#         except Transaction.DoesNotExist:
#             return Response({"error": "Transaction not found"}, status=404)

#     # ============================
#     # 📩 EMAIL FUNCTIONS
#     # ============================
#     def send_income_email(self, user, amount, category):
#         message = f"""Hi {user.username},

# Income credited successfully 💰

# Amount: ₹{amount}
# Category: {category.name if category else "General"}

# Keep growing your savings 🚀

# - Team FinAI
# """
#         send_transaction_email.delay(user.email, message, "Income Credited 💰")

#     def send_expense_email(self, user, amount, category):
#         message = f"""Hi {user.username},

# Expense recorded 💸

# Amount: ₹{amount}
# Category: {category.name if category else "General"}

# Stay within your budget ⚠️

# - Team FinAI
# """.strip()
        
#         send_transaction_email.delay(user.email, message, "Expense Debited 💸")

#     # ============================
#     # ⚠️ BUDGET ALERT LOGIC
#     # ============================
#     def handle_budget_alert(self, user, category, now):

#         budget = Budget.objects.filter(
#             user=user,
#             category=category,
#             month=now.month,
#             year=now.year
#         ).first()

#         if not budget:
#             return

#         total_expense = Transaction.objects.filter(
#             user=user,
#             type="expense",
#             category=category,
#             date__month=now.month,
#             date__year=now.year
#         ).aggregate(Sum("amount"))["amount__sum"] or 0

#         if not budget.alert_80_sent and total_expense >= budget.amount * Decimal("0.8"):
#             message = f"""⚠️ Budget Alert!

# Category: {category.name}
# Used: ₹{total_expense}
# Budget: ₹{budget.amount}

# You have used 80% of your budget.
# """
#             send_transaction_email.delay(user.email, message, "Budget Warning ⚠️")

#             budget.alert_80_sent = True
#             budget.save()

      
#         if not budget.alert_100_sent and total_expense >= budget.amount:
#             message = f"""🚨 Budget Exceeded!

# Category: {category.name}
# Spent: ₹{total_expense}
# Budget: ₹{budget.amount}

# You have exceeded your budget!
# """
#             send_transaction_email.delay(user.email, message, "Budget Exceeded 🚨")

#             budget.alert_100_sent = True
#             budget.save()




class TransactionView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        # ✅ MULTI-TENANT FILTER
        if user.company:
            transactions = Transaction.objects.filter(
                company=user.company
            )
        else:
            transactions = Transaction.objects.filter(
                user=user
            )

        transactions = transactions.order_by("-date")

        # 🔍 FILTERS
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

            user = request.user
            company = user.company
            category = serializer.validated_data.get("category")


            # 🤖 AI CATEGORY PREDICTION (Only if not selected by user)
            description = request.data.get("description", "")

            if not category and description:
                try:
                    ai_response = requests.post(
                        "http://127.0.0.1:8001/predict-category",
                        json={"description": description},
                        timeout=2
                    )

                    if ai_response.status_code == 200:
                        predicted = ai_response.json().get("category")

                        if predicted:
                            from .models import Category

                            # match predicted category from DB (Secured for Multi-Tenancy)
                            if company:
                                ai_category = Category.objects.filter(
                                    name__iexact=predicted, company=company
                                ).first()
                            else:
                                ai_category = Category.objects.filter(
                                    name__iexact=predicted, user=user
                                ).first()

                            if ai_category:
                                category = ai_category

                except Exception:
                    pass  # if AI fails, continue normally


            # 🔐 CATEGORY VALIDATION 
          
            if company:
                if category and category.company != company:
                    return Response({"error": "Invalid category for this company"}, status=400)
            else:
                if category and category.user != user:
                    return Response({"error": "Invalid category for this user"}, status=400)

         
            # 🔍 GET ROLE
           
            role = None
            if company:
                from tenants.models import CompanyUser
                cu = CompanyUser.objects.filter(
                    email=user.email,
                    company=company
                ).first()

                if cu:
                    role = cu.role

          
            if not company:
                status_value = "approved"

            elif role == "accountant":
                status_value = "pending"

            else:
                status_value = "approved"

          
            transaction = serializer.save(
                user=user,
                company=company,
                status=status_value
            )

            
            amount = transaction.amount
            t_type = transaction.type
            category = transaction.category
            now = timezone.now()

            if t_type == "income":
                self.send_income_email(user, amount, category)

            elif t_type == "expense":
                self.send_expense_email(user, amount, category)
                self.handle_budget_alert(user, category, now)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

   
    def delete(self, request, pk):
        try:
            if request.user.company:
                transaction = Transaction.objects.get(
                    id=pk,
                    company=request.user.company
                )
            else:
                transaction = Transaction.objects.get(
                    id=pk,
                    user=request.user
                )

            transaction.delete()
            return Response({"message": "Transaction deleted successfully"}, status=200)

        except Transaction.DoesNotExist:
            return Response({"error": "Transaction not found"}, status=404)

  
    def send_income_email(self, user, amount, category):
        company_name = user.company.name if user.company else "FinAI"
        message = f"""Hi {user.username},

Income credited successfully 💰

Amount: ₹{amount}
Category: {category.name if category else "General"}

Keep growing your savings 🚀

- Team {company_name}
"""
        send_transaction_email.delay(user.email, message, "Income Credited 💰")

    def send_expense_email(self, user, amount, category):
        company_name = user.company.name if user.company else "FinAI"
        message = f"""Hi {user.username},

Expense recorded 💸

Amount: ₹{amount}
Category: {category.name if category else "General"}

Stay within your budget ⚠️

- Team {company_name}
"""
        send_transaction_email.delay(user.email, message, "Expense Debited 💸")

    # ============================
    # ⚠️ BUDGET ALERT LOGIC
    # ============================
    def handle_budget_alert(self, user, category, now):

        # 🔍 GET BUDGET
        if user.company:
            budget = Budget.objects.filter(
                company=user.company,
                category=category,
                month=now.month,
                year=now.year
            ).first()
        else:
            budget = Budget.objects.filter(
                user=user,
                category=category,
                month=now.month,
                year=now.year
            ).first()

        if not budget:
            return

        # 🔍 CALCULATE EXPENSE
        if user.company:
            total_expense = Transaction.objects.filter(
                company=user.company,
                type="expense",
                category=category,
                date__month=now.month,
                date__year=now.year,
                status="approved"
            ).aggregate(Sum("amount"))["amount__sum"] or 0
        else:
            total_expense = Transaction.objects.filter(
                user=user,
                type="expense",
                category=category,
                date__month=now.month,
                date__year=now.year
            ).aggregate(Sum("amount"))["amount__sum"] or 0

        # ⚠️ 80% ALERT
        if not budget.alert_80_sent and total_expense >= budget.amount * Decimal("0.8"):
            send_transaction_email.delay(
                user.email,
                f"80% budget used for {category.name}",
                "Budget Warning ⚠️"
            )
            budget.alert_80_sent = True
            budget.save()

        # 🚨 100% ALERT
        if not budget.alert_100_sent and total_expense >= budget.amount:
            send_transaction_email.delay(
                user.email,
                f"Budget exceeded for {category.name}",
                "Budget Exceeded 🚨"
            )
            budget.alert_100_sent = True
            budget.save()



# BUDGET API
class BudgetView(APIView):

    permission_classes = [IsAuthenticated]

    # ============================
    # 📥 GET BUDGETS
    # ============================
    def get(self, request):

        now = timezone.now()
        user = request.user

        # ✅ MULTI-TENANT FILTER
        if user.company:
            budgets = Budget.objects.filter(
                company=user.company,
                month=now.month,
                year=now.year
            )
        else:
            budgets = Budget.objects.filter(
                user=user,
                month=now.month,
                year=now.year
            )

        serializer = BudgetSerializer(budgets, many=True)
        return Response(serializer.data)

    # ============================
    # ➕ CREATE BUDGET
    # ============================
    def post(self, request):

        serializer = BudgetSerializer(data=request.data)

        if serializer.is_valid():

            now = timezone.now()
            user = request.user
            company = user.company
            category = serializer.validated_data.get("category")

            # ============================
            # 🔐 CATEGORY VALIDATION (IMPORTANT)
            # ============================
            if company:
                if category and category.company != company:
                    return Response({"error": "Invalid category for this company"}, status=400)
            else:
                if category and category.user != user:
                    return Response({"error": "Invalid category for this user"}, status=400)

            # ============================
            # 🔍 CHECK EXISTING BUDGET
            # ============================
            if company:
                existing_budget = Budget.objects.filter(
                    company=company,
                    category=category,
                    month=now.month,
                    year=now.year
                ).first()
            else:
                existing_budget = Budget.objects.filter(
                    user=user,
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
                user=user if not company else None,
                company=company,
                month=now.month,
                year=now.year
            )

            
            company_name = company.name if company else "FinAI"

            message = f"""Hi {user.username},

Your budget has been set successfully 🎯

Category: {category.name}
Amount: ₹{budget.amount}
Month: {now.strftime('%B %Y')}

- Team {company_name}
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

            if request.user.company:
                budget = Budget.objects.get(
                    id=pk,
                    company=request.user.company
                )
            else:
                budget = Budget.objects.get(
                    id=pk,
                    user=request.user
                )

            budget.delete()
            return Response({"message": "Budget deleted successfully"}, status=200)

        except Budget.DoesNotExist:
            return Response({"error": "Budget not found"}, status=404)
        


class DashboardSummaryAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user
        now = timezone.now()

        # ============================
        # 🔐 BASE QUERY (MULTI-TENANT)
        # ============================
        if user.company:
            base_queryset = Transaction.objects.filter(
                company=user.company,
                status="approved"   # VERY IMPORTANT
            )
        else:
            base_queryset = Transaction.objects.filter(
                user=user
            )

        # ============================
        # ✅ CURRENT MONTH DATA
        # ============================
        current_transactions = base_queryset.filter(
            date__month=now.month,
            date__year=now.year
        )

        total_income = current_transactions.filter(type="income") \
            .aggregate(Sum("amount"))["amount__sum"] or 0

        total_expense = current_transactions.filter(type="expense") \
            .aggregate(Sum("amount"))["amount__sum"] or 0

        total_savings = total_income - total_expense

        # ============================
        # 📊 LAST 6 MONTHS GRAPH
        # ============================
        six_months_ago = now - timedelta(days=180)

        monthly_activity = base_queryset.filter(
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

        user = request.user
        now = timezone.now()

        if user.company:
            transactions = Transaction.objects.filter(
                company=user.company,
                status="approved"   # VERY IMPORTANT
            )
            company_name = user.company.name
        else:
            transactions = Transaction.objects.filter(
                user=user
            )
            company_name = "FinAI"

       
        transactions = transactions.filter(
            date__month=now.month,
            date__year=now.year
        ).select_related("category")

        # 💰 SUMMARY
       
        total_income = transactions.filter(type="income") \
            .aggregate(Sum("amount"))["amount__sum"] or 0

        total_expense = transactions.filter(type="expense") \
            .aggregate(Sum("amount"))["amount__sum"] or 0

        total_savings = total_income - total_expense

        # ============================
        # 📄 CREATE CSV RESPONSE
        # ============================
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f'attachment; filename="{company_name}_Report_{now.month}_{now.year}.csv"'

        writer = csv.writer(response)

        # ============================
        # 📊 HEADER
        # ============================
        writer.writerow([f"{company_name.upper()} MONTHLY REPORT"])
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
                t.date.strftime("%d-%m-%Y"),
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

        # ============================
        # 🔐 BASE QUERY (MULTI-TENANT)
        # ============================
        if user.company:
            base_queryset = Transaction.objects.filter(
                company=user.company,
                status="approved"
            )
        else:
            base_queryset = Transaction.objects.filter(
                user=user
            )

        expenses = base_queryset.filter(type="expense")
        income = base_queryset.filter(type="income") \
            .aggregate(Sum("amount"))["amount__sum"] or 0

        insights = []

        # ============================
        # 🧠 1. HIGH FOOD SPENDING
        # ============================
        if income > 0:
            food_spending = expenses.filter(
                category__name__icontains="food"
            ).aggregate(Sum("amount"))["amount__sum"] or 0

            food_percent = (food_spending / income) * 100

            if food_percent > 30:
                insights.append({
                    "title": "High Food Spending",
                    "description": f"You spent {food_percent:.1f}% of your income on food.",
                    "type": "warning"
                })

        # ============================
        # 🧠 2. LOW SAVINGS
        # ============================
        total_expense = expenses.aggregate(Sum("amount"))["amount__sum"] or 0
        savings = income - total_expense

        if income > 0:
            savings_percent = (savings / income) * 100

            if savings_percent < 20:
                insights.append({
                    "title": "Low Savings",
                    "description": f"You are saving only {savings_percent:.1f}% of your income.",
                    "type": "warning"
                })

        # ============================
        # 🧠 3. HIGH SPENDING CATEGORY
        # ============================
        top_category = expenses.values("category__name") \
            .annotate(total=Sum("amount")) \
            .order_by("-total") \
            .first()

        if top_category:
            insights.append({
                "title": "Top Spending Category",
                "description": f"Most spending is on {top_category['category__name']}.",
                "type": "info"
            })

        # ============================
        # 🧠 4. FINANCIAL HEALTH
        # ============================
        if not insights:
            insights.append({
                "title": "Financial Health OK",
                "description": "Your spending patterns look stable.",
                "type": "success"
            })

        return Response(insights)    


class PendingTransactionsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user = request.user

        if not user.company:
            return Response({"error": "Not a company user"}, status=403)

        # 🔍 CHECK ROLE
        cu = CompanyUser.objects.filter(
            email=user.email,
            company=user.company
        ).first()

        if not cu or cu.role not in ["admin", "manager"]:
            return Response({"error": "Not allowed"}, status=403)

        transactions = Transaction.objects.filter(
            company=user.company,
            status="pending"
        ).order_by("-date")

        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    
# class ApproveTransactionView(APIView):

#     permission_classes = [IsAuthenticated]

#     def post(self, request, pk):

#         user = request.user

#         if not user.company:
#             return Response({"error": "Not a company user"}, status=403)

#         # 🔍 ROLE CHECK
#         cu = CompanyUser.objects.filter(
#             email=user.email,
#             company=user.company
#         ).first()

#         if not cu or cu.role not in ["admin", "manager"]:
#             return Response({"error": "Not allowed"}, status=403)

#         try:
#             transaction = Transaction.objects.get(
#                 id=pk,
#                 company=user.company
#             )

#         except Transaction.DoesNotExist:
#             return Response({"error": "Transaction not found"}, status=404)

#         action = request.data.get("action")  # approve / reject
#         if action not in ["approve", "reject"]:
#             return Response({"error": "Invalid action"}, status=400)

#         if action == "approve":
#             transaction.status = "approved"

#         elif action == "reject":
#             transaction.status = "rejected"

#         else:
#             return Response({"error": "Invalid action"}, status=400)

#         transaction.save()

#         return Response({"message": f"Transaction {transaction.status}"})

class ApproveTransactionView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        user = request.user

        if not user.company:
            return Response({"error": "Not a company user"}, status=403)

        # 🔍 ROLE CHECK
        cu = CompanyUser.objects.filter(
            email=user.email,
            company=user.company
        ).first()

        if not cu or cu.role not in ["admin", "manager"]:
            return Response({"error": "Not allowed"}, status=403)

        try:
            transaction = Transaction.objects.get(
                id=pk,
                company=user.company
            )
        except Transaction.DoesNotExist:
            return Response({"error": "Transaction not found"}, status=404)

        action = request.data.get("action")  # approve / reject

        if action not in ["approve", "reject"]:
            return Response({"error": "Invalid action"}, status=400)

        # ✅ UPDATE STATUS
        if action == "approve":
            transaction.status = "approved"
        else:
            transaction.status = "rejected"

        transaction.save()


        try:
            Notification.objects.create(
                user=transaction.user,   # 👈 accountant (receiver)
                message=f"Your transaction has been {transaction.status} by {user.username}"
            )
        except Exception as e:
            print("Notification DB Error:", e)


       
        # 🔔 WEBSOCKET NOTIFICATION (NEW)
        
        try:
            channel_layer = get_channel_layer()

            async_to_sync(channel_layer.group_send)(
                f"user_{transaction.user.id}",   # 👈 accountant user
                {
                    "type": "send_notification",
                    "message": f"Your transaction has been {transaction.status} by {user.username}"
                }
            )
        except Exception as e:
            print("WebSocket Error:", e)

       
        return Response({
            "message": f"Transaction {transaction.status}",
            "status": transaction.status
        })