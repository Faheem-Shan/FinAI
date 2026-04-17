# from django.contrib.auth.models import User
# from django.db import models


# class UserProfile(models.Model):

#     user = models.OneToOneField(
#         User,
#         on_delete=models.CASCADE,
#         related_name="profile"
#     )

#     profile_picture = models.ImageField(
#         upload_to="profile_pictures/",
#         blank=True,
#         null=True
#     )

#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.user.username

from django.contrib.auth.models import AbstractUser
from django.db import models
from tenants.models import Company

class CustomUser(AbstractUser):
    profile_picture = models.ImageField(
        upload_to="profile_pictures/",
        blank=True,
        null=True
    )

    company = models.ForeignKey(
        Company,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    def __str__(self):
        return self.username