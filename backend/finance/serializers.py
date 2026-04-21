from rest_framework import serializers
from .models import Category, Transaction, Budget


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ["id", "name", "type"]


class TransactionSerializer(serializers.ModelSerializer):

    category_name = serializers.ReadOnlyField(source="category.name")
    user_name = serializers.ReadOnlyField(source="user.username")
    user_role = serializers.SerializerMethodField()
    approved_by_name = serializers.SerializerMethodField()
    approved_at = serializers.DateTimeField(read_only=True)


    class Meta:
        model = Transaction
        fields = [
            "id",
            "user",
            "user_name",
            "user_role",
            "company",
            "category",
            "category_name",
            "amount",
            "type",
            "description",
            "date",
            "status",
            "created_at",
            "approved_by_name",
            "approved_at",
        ]
        read_only_fields = ["user","company", "status"]

    def get_user_role(self, obj):
        from tenants.models import CompanyUser
        if obj.company and obj.user:
            cu = CompanyUser.objects.filter(email=obj.user.email, company=obj.company).first()
            return cu.role if cu else "personal"
        return "personal"
    
    def get_approved_by_name(self, obj):
        if obj.approved_by:
            return obj.approved_by.username
        return None



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
        read_only_fields = ["user",]