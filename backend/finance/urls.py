from django.urls import path
from .views import (
    CategoryView,
    TransactionView,
    BudgetView,
    DashboardSummaryAPIView,
    ExportTransactionsCSV,
    AIInsightsAPIView
)

urlpatterns = [

    path("categories/", CategoryView.as_view(), name="categories"),
    path("transactions/", TransactionView.as_view(), name="transactions"),
    path("budgets/", BudgetView.as_view(), name="budgets"),

    path("dashboard/", DashboardSummaryAPIView.as_view(), name="dashboard"),

    path("export/", ExportTransactionsCSV.as_view(), name="export"),

    path("insights/", AIInsightsAPIView.as_view(), name="insights"),
]