# from django.http import JsonResponse
# from .models import Company


# class TenantMiddleware:

#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         # host = request.get_host().split(':')[0]

#         # # 1. 🔍 Try to find company by domain (Production Flow)
#         # company = Company.objects.filter(domain=host).first()

#         # # 2. 🏠 Fallback for Development: If on localhost/127.0.0.1, find user's default company
#         # if not company and (host == 'localhost' or host == '127.0.0.1') and request.user.is_authenticated:
#         #     from tenants.models import CompanyUser
#         #     cu = CompanyUser.objects.filter(email=request.user.email).first()
#         #     if cu:
#         #         company = cu.company

#         # request.company = company
#         request.company = None

#         # # 3. 🔐 Access Check: Ensure logged in user belongs to this tenant domain
#         # if request.user.is_authenticated and request.company:
#         #     from tenants.models import CompanyUser
#         #     if not CompanyUser.objects.filter(email=request.user.email, company=request.company).exists():
#         #          from django.http import JsonResponse
#         #          return JsonResponse({"error": "Access Denied: You do not belong to this organization"}, status=403)

#         return self.get_response(request)