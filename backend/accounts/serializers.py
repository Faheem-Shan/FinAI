# from rest_framework import serializers
# from django.contrib.auth.models import User
# from .models import UserProfile


# class RegisterSerializer(serializers.ModelSerializer):

#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = User
#         fields = ["id", "username", "email", "password"]

#     def create(self, validated_data):

#         user = User.objects.create_user(
#             username=validated_data["username"],
#             email=validated_data["email"],
#             password=validated_data["password"]
#         )

#         UserProfile.objects.create(user=user)

#         return user


# class UserSerializer(serializers.ModelSerializer):

#     profile_picture = serializers.ImageField(
#         source="profile.profile_picture",
#         read_only=True
#     )

#     class Meta:
#         model = User
#         fields = [
#             "id",
#             "username",
#             "email",
#             "first_name",
#             "last_name",
#             "profile_picture"
#         ]


from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()



class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        username = attrs.get("username")

        
        user = User.objects.filter(email=username).first()

        if user:
            attrs["username"] = user.username

        # Default JWT validation
        data = super().validate(attrs)

        
        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "company": self.user.company.name if self.user.company else None
        }

        return data


class UserSerializer(serializers.ModelSerializer):

    profile_picture = serializers.ImageField(read_only=True)
    tenant_details = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "profile_picture",
            "company", 
            "tenant_details",
            "role",
        ]

    def get_tenant_details(self, obj):
        if obj.company:
            return {
                "id": obj.company.id,
                "name": obj.company.name,
                "domain": obj.company.domain
            }
        return None

    def get_role(self, obj):
        if obj.company:
            from tenants.models import CompanyUser
            cu = CompanyUser.objects.filter(
                email=obj.email, 
                company=obj.company
            ).first()
            return cu.role if cu else "accountant"
        return None
