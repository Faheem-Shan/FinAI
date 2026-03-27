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

User = get_user_model()


# 🔹 REGISTER SERIALIZER
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


# 🔹 USER PROFILE SERIALIZER
class UserSerializer(serializers.ModelSerializer):

    profile_picture = serializers.ImageField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "profile_picture"
        ]