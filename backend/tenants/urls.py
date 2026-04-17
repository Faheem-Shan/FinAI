from django.urls import path
from .views import InviteUserView, CompanyUsersView

urlpatterns = [
    path("invite/", InviteUserView.as_view(), name="invite-user"),
    path("users/", CompanyUsersView.as_view(), name="company-users"),
]
