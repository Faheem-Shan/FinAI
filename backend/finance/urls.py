from django.urls import path
from .views import (
    CategoryView,
    TransactionView,
    BudgetView,
    DashboardSummaryAPIView,
    ExportTransactionsCSV,
    AIInsightsAPIView,
    PendingTransactionsView,
    ApproveTransactionView
)

urlpatterns = [

    path("categories/", CategoryView.as_view(), name="categories"),
    path("transactions/", TransactionView.as_view(), name="transactions"),
    path("transactions/<int:pk>/", TransactionView.as_view(), name="transaction_detail"),
    
    path("transactions/pending/", PendingTransactionsView.as_view(),name="pending-transactions"),
    path("transactions/<int:pk>/approve/", ApproveTransactionView.as_view(),name="approve-transaction"),

    path("budgets/", BudgetView.as_view(), name="budgets"),
    path("budgets/<int:pk>/", BudgetView.as_view(), name="budget_detail"),
    path("dashboard/", DashboardSummaryAPIView.as_view(), name="dashboard"),

    path("export/", ExportTransactionsCSV.as_view(), name="export"),

    path("insights/", AIInsightsAPIView.as_view(), name="insights"),
]