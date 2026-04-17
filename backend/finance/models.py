# from django.db import models
# from django.conf import settings


# class Category(models.Model):

#     TYPE_CHOICES = (
#         ("income", "Income"),
#         ("expense", "Expense"),
#     )

#     user = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.CASCADE,
#         related_name="categories"
#     )
#     company = models.ForeignKey(
#         "tenants.Company",
#         on_delete=models.CASCADE,
#         null=True,
#         blank=True
#     )

#     name = models.CharField(max_length=100)

#     type = models.CharField(
#         max_length=10,
#         choices=TYPE_CHOICES,
#         default="expense"
#     )

#     class Meta:
#         constraints = [
#             models.UniqueConstraint(
#                 fields=["user", "name", "type"],
#                 name="unique_user_category"
#             ),
#             models.UniqueConstraint(
#                 fields=["company", "name", "type"],
#                 name="unique_company_category"
#             )
#         ]
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.name


# class Transaction(models.Model):

#     TRANSACTION_TYPE = (
#         ("income", "Income"),
#         ("expense", "Expense"),
#     )

#     STATUS_CHOICES = (
#         ("pending", "Pending"),
#         ("approved", "Approved"),
#         ("rejected", "Rejected"),
#     )

#     user = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.CASCADE,
#         related_name="transactions"
#     )

#     company = models.ForeignKey(
#         "tenants.Company",
#         on_delete=models.CASCADE,
#         null=True,
#         blank=True
#     )


#     category = models.ForeignKey(
#         Category,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True
#     )

#     amount = models.DecimalField(max_digits=10, decimal_places=2)

#     type = models.CharField(
#         max_length=10,
#         choices=TRANSACTION_TYPE
#     )

#     description = models.CharField(
#         max_length=255,
#         blank=True
#     )

#     date = models.DateField()

#     status = models.CharField(
#         max_length=10,
#         choices=STATUS_CHOICES,
#         default="approved"
#     )

#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.type} - {self.amount}"


# class Budget(models.Model):

#     user = models.ForeignKey(
#         settings.AUTH_USER_MODEL,
#         on_delete=models.CASCADE,
#         related_name="budgets"
#     )
#     company = models.ForeignKey(
#         "tenants.Company",
#         on_delete=models.CASCADE,
#         null=True,
#         blank=True
#     )

#     category = models.ForeignKey(
#         Category,
#         on_delete=models.CASCADE
#     )

#     amount = models.DecimalField(
#         max_digits=10,
#         decimal_places=2
#     )

#     month = models.IntegerField()

#     year = models.IntegerField()

#     alert_80_sent = models.BooleanField(default=False)
#     alert_100_sent = models.BooleanField(default=False)

#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.category.name} Budget"

from django.db import models
from django.conf import settings


# ============================
# 📂 CATEGORY MODEL
# ============================
class Category(models.Model):

    TYPE_CHOICES = (
        ("income", "Income"),
        ("expense", "Expense"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="categories",
        null=True,
        blank=True
    )

    company = models.ForeignKey(
        "tenants.Company",
        on_delete=models.CASCADE,
        related_name="categories",
        null=True,
        blank=True
    )

    name = models.CharField(max_length=100)

    type = models.CharField(
        max_length=10,
        choices=TYPE_CHOICES,
        default="expense"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "name", "type"],
                name="unique_user_category"
            ),
            models.UniqueConstraint(
                fields=["company", "name", "type"],
                name="unique_company_category"
            )
        ]

    def __str__(self):
        return f"{self.name} ({self.type})"


# ============================
# 💰 TRANSACTION MODEL
# ============================
class Transaction(models.Model):

    TRANSACTION_TYPE = (
        ("income", "Income"),
        ("expense", "Expense"),
    )

    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transactions"
    )

    company = models.ForeignKey(
        "tenants.Company",
        on_delete=models.CASCADE,
        related_name="transactions",
        null=True,
        blank=True
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    amount = models.DecimalField(max_digits=10, decimal_places=2)

    type = models.CharField(
        max_length=10,
        choices=TRANSACTION_TYPE
    )

    description = models.CharField(
        max_length=255,
        blank=True
    )

    date = models.DateField()

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="approved"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.type} - ₹{self.amount}"


# ============================
# 🎯 BUDGET MODEL
# ============================
class Budget(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="budgets",
        null=True,
        blank=True
    )

    company = models.ForeignKey(
        "tenants.Company",
        on_delete=models.CASCADE,
        related_name="budgets",
        null=True,
        blank=True
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    month = models.IntegerField()
    year = models.IntegerField()

    alert_80_sent = models.BooleanField(default=False)
    alert_100_sent = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "category", "month", "year"],
                name="unique_user_budget"
            ),
            models.UniqueConstraint(
                fields=["company", "category", "month", "year"],
                name="unique_company_budget"
            )
        ]

    def __str__(self):
        return f"{self.category.name} Budget ({self.month}/{self.year})"