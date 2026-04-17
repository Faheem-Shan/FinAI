from django.urls import path
from rest_framework_simplejwt.views import  TokenRefreshView
from .views import RegisterView, ProfileView,ForgotPasswordView,ResetPasswordView,CustomLoginView


urlpatterns = [

    path("register/", RegisterView.as_view(), name="register"),

    path("login/",CustomLoginView.as_view(), name="login"),

    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path("profile/", ProfileView.as_view(), name="profile"),
    
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),

    path("reset-password/<uidb64>/<token>/", ResetPasswordView.as_view(), name="reset-password"),
]