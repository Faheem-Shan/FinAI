from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def send_contact_email(name, email, message):
    full_message = f"""
New Contact Form Submission

Name: {name}
Email: {email}

Message:
{message}
"""

    send_mail(
        subject="New Contact Form Submission - FinAI",
        message=full_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.EMAIL_HOST_USER],  # your inbox mail
        fail_silently=False,
    )

@shared_task
def send_welcome_email_task(username, email, company_name):
    message = f"""Hi {username},

Welcome to FinAI 🎉

We're excited to have you on board!

✨ What you can do now:
- Track your income and expenses
- Get AI-powered financial insights
- Manage budgets effectively

🏢 Workspace: {company_name}

Start managing your finances smarter 🚀

- Team FinAI
"""

    send_mail(
        subject="Welcome to FinAI 🎉",
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )


# ✅ Forgot Password Reset Email Task
@shared_task
def send_password_reset_email_task(username, email, reset_link):
    message = f"""Hi {username},

You requested a password reset.

Click the link below to reset your password:

{reset_link}

If you didn't request this, please ignore this email.

- Team FinAI
"""

    send_mail(
        subject="Password Reset - FinAI",
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        fail_silently=False,
    )