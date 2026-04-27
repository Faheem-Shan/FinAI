from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.contrib.auth import get_user_model
from django.conf import settings  
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from .utils import password_reset_token
from tenants.models import Company,CompanyUser
from .serializers import RegisterSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer
from .tasks import send_contact_email
from rest_framework.throttling import AnonRateThrottle
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password


from .tasks import (
    send_contact_email,
    send_welcome_email_task,
    send_password_reset_email_task,
)


User = get_user_model()
# REGISTER USER
# class RegisterView(APIView):

#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = RegisterSerializer(data=request.data)

#         if serializer.is_valid():
            
#             #  Get Extra Fields
#             account_type = request.data.get("account_type", "personal") # 'personal' or 'business'
#             company_name = request.data.get("company_name", "").strip()

#             #  BUSINESS FLOW: CREATE COMPANY
#             if account_type == "business" and company_name:
                
#                 # Check if company exists (case-insensitive)
#                 existing_company = Company.objects.filter(name__iexact=company_name).first()
#                 if existing_company:
#                     return Response({
#                         "error": "Company already exists. Please contact your admin or request an invite."
#                     }, status=400)

#                 # Create Company
#                 company = Company.objects.create(
#                     name=company_name,
#                     domain=company_name.lower().replace(" ", "-") # Simple slug
#                 )

#                 # Save User and explicitly link to Company
#                 user = serializer.save()
#                 user.company = company
#                 user.save()

#                 # Assign first user as Admin
#                 CompanyUser.objects.create(
#                     company=company,
#                     email=user.email,
#                     name=user.username,
#                     role="admin"
#                 )
            
#             else:
#                 user = serializer.save()
#                 email = user.email

#                 if company_name:
#                     company = Company.objects.filter(name__iexact=company_name).first()

#                     if company:
#                         # 🔐 CHECK INVITATION FOR THIS COMPANY
#                         company_user = CompanyUser.objects.filter(
#                             email=email,
#                             company=company
#                         ).first()

#                         if not company_user:
#                             return Response({
#                                 "error": "You are not invited to this company. Please contact admin."
#                             }, status=400)

                        
#                         user.company = company
#                         user.save()

#                     else:
#                         # Company not found → treat as personal
#                         user.company = None
#                         user.save()

#                 else:
#                     # No company → personal user
#                     user.company = None
#                     user.save()

#             # SEND WELCOME EMAIL
#             message = f"""Hi {user.username},

# Welcome to FinAI 🎉

# We're excited to have you on board!

# Start managing your finances smarter 

# - Team FinAI
# """
#             send_mail(
#                 subject='Welcome to FinAI 🎉',
#                 message=message,
#                 from_email=settings.DEFAULT_FROM_EMAIL,
#                 recipient_list=[user.email],
#                 fail_silently=True,
#             )

#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            # 🔍 Extract fields for validation BEFORE saving the user
            email = serializer.validated_data.get('email')
            account_type = request.data.get("account_type", "personal")
            company_name = request.data.get("company_name", "").strip()

            # 1️⃣ STEP 1: CHECK INVITATION (Priority #1)
            invitation = CompanyUser.objects.filter(email=email).first()

            if invitation:
                user = serializer.save()
                user.company = invitation.company
                user.save()
                
                invitation.name = user.username
                invitation.save()

            # 2️⃣ STEP 2: BUSINESS FLOW
            elif account_type == "business":
                if not company_name:
                    return Response({"error": "Company name is required."}, status=400)

                if Company.objects.filter(name__iexact=company_name).exists():
                    return Response({
                        "error": "Company already exists. Please contact your admin for an invite."
                    }, status=400)

                company = Company.objects.create(
                    name=company_name,
                    domain=company_name.lower().replace(" ", "-")
                )

                user = serializer.save()
                user.company = company
                user.save()

                CompanyUser.objects.create(
                    company=company,
                    email=user.email,
                    name=user.username,
                    role="admin"
                )

            # PERSONAL FLOW
            else:
                user = serializer.save()
                user.company = None
                user.save()

            company_name = user.company.name if user.company else "FinAI"

            send_welcome_email_task.delay(
                user.username,
                user.email,
                company_name
            )


            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class CustomLoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

# USER PROFILE
class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    # def put(self, request):
    #     user = request.user
    #     # data = request.data

    #     # user.first_name = data.get("first_name", user.first_name)
    #     # user.last_name = data.get("last_name", user.last_name)
    #     # user.email = data.get("email", user.email)

    #     # # Update password if provided
    #     # password = data.get("password")
    #     # if password:
    #     #     user.set_password(password)

    #     # # Update profile picture
    #     # profile_picture = request.FILES.get("profile_picture")
    #     # if profile_picture:
    #     #     user.profile_picture = profile_picture

    #     # user.save()

    #     # serializer = UserSerializer(user)
    #     # return Response(serializer.data)
    def put(self, request):
        user = request.user

        serializer = UserSerializer(
            user,
            data=request.data,
            partial=True  # allows partial update
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
class ForgotPasswordView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip()
        if not email:
            return Response({"error": "Email is required"}, status=400)

        try:
            user = User.objects.get(email=email)

            # generate uid + token
            uid = urlsafe_base64_encode(force_bytes(user.id))
            token = password_reset_token.make_token(user)

            # frontend URL (React)
            reset_link = f"https://finai-ai.vercel.app/reset/{uid}/{token}/"
            
            send_password_reset_email_task.delay(
                            user.username,
                            email,
                            reset_link
                        )

            return Response({"message": "If email exists, reset link sent"})

        except User.DoesNotExist:
            return Response({"message": "If email exists, reset link sent"})



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

            try:
                validate_password(password, user)

            except ValidationError as e:
                return Response(
                    {
                        "error": e.messages
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            
            # set new password
            user.set_password(password)
            user.save()

            return Response({"message": "Password reset successful"},status=status.HTTP_200_OK)

        except Exception:
            return Response({"error": "Something went wrong"}, status=400)
        
class ContactUsView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [AnonRateThrottle]

    def post(self, request):
        name = request.data.get("name")
        email = request.data.get("email")
        message = request.data.get("message")

        if not all([name, email, message]):
            return Response(
                {"error": "All fields are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            validate_email(email)
        except ValidationError:
            return Response(
                {"error": "Invalid email address"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            send_contact_email.delay(name, email, message)
        except Exception:
            return Response(
                {
                    "error": "Service temporarily unavailable. Please try again later."
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

        return Response(
            {"message": "Message sent successfully"},
            status=status.HTTP_200_OK
        )