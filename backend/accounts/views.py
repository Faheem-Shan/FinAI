from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model

from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from .utils import password_reset_token

from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()

# REGISTER USER
class RegisterView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# USER PROFILE
class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        data = request.data

        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.email = data.get("email", user.email)

        #  update profile picture
        profile_picture = data.get("profile_picture")
        if profile_picture:
            user.profile_picture = profile_picture

        user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data)
    
class ForgotPasswordView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)

            # generate uid + token
            uid = urlsafe_base64_encode(force_bytes(user.id))
            token = password_reset_token.make_token(user)

            # frontend URL (React)
            reset_link = f"http://localhost:5173/reset/{uid}/{token}/"

            # send email (console for now)
            send_mail(
                subject="Password Reset",
                message=f"Click this link to reset your password: {reset_link}",
                from_email=None,
                recipient_list=[email],
            )

            return Response({"message": "Reset link sent to email"})

        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)



class ResetPasswordView(APIView):

    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):

        try:
            # decode user id
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id=uid)

            # verify token
            if not password_reset_token.check_token(user, token):
                return Response({"error": "Invalid or expired token"}, status=400)

            # get new password
            password = request.data.get("password")

            if not password:
                return Response({"error": "Password is required"}, status=400)

            # set new password
            user.set_password(password)
            user.save()

            return Response({"message": "Password reset successful"})

        except Exception:
            return Response({"error": "Something went wrong"}, status=400)