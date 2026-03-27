from rest_framework import serializers
from .models import Category, Transaction, Budget


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ["id", "name", "type"]


class TransactionSerializer(serializers.ModelSerializer):

    category_name = serializers.ReadOnlyField(source="category.name")

    class Meta:
        model = Transaction
        fields = [
            "id",
            "user",
            "category",
            "category_name",
            "amount",
            "type",
            "description",
            "date",
            "created_at"
        ]
        read_only_fields = ["user"]


class BudgetSerializer(serializers.ModelSerializer):

    category_name = serializers.ReadOnlyField(source="category.name")

    class Meta:
        model = Budget
        fields = [
            "id",
            "user",
            "category",
            "category_name",
            "amount",
            "month",
            "year",
            "created_at"
        ]
        read_only_fields = ["user"]