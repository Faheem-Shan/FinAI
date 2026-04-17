from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.conf import settings

from .models import CompanyUser


class InviteUserView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user
        company = user.company

        #  Only company users allowed
        if not company:
            return Response({"error": "Not allowed"}, status=403)

        
        cu = CompanyUser.objects.filter(email=user.email, company=company).first()
        if not cu or cu.role != "admin":
            return Response({"error": "Admin access required to invite users"}, status=403)

        email = request.data.get("email")
        role = request.data.get("role", "accountant")

        if not email:
            return Response({"error": "Email required"}, status=400)

        
        CompanyUser.objects.update_or_create(
            company=company,
            email=email,
            defaults={'role': role}
        )

        # 🔗 Invite link
        invite_link = f"http://localhost:5173/register?email={email}"

        # 📩 Email content
        message = f"""
Hi,

You have been invited to join {company.name} on FinAI 🚀

Click below to register:
{invite_link}

- Team {company.name}
"""

        send_mail(
            subject=f"Invitation to join {company.name}",
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({"message": "Invitation sent successfully"})


class CompanyUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        company = user.company

        if not company:
            return Response({"error": "Not allowed"}, status=403)

        #  Ensure user is Admin
        from tenants.models import CompanyUser
        cu = CompanyUser.objects.filter(email=user.email, company=company).first()
        if not cu or cu.role != "admin":
            return Response({"error": "Admin access required"}, status=403)

        users = CompanyUser.objects.filter(company=company)
        data = [{
            "id": u.id,
            "email": u.email,
            "name": u.name,
            "role": u.role
        } for u in users]

        return Response(data)

