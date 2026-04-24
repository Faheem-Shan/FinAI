class CompanyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            request.company = request.user.company
        else:
            request.company = None

        return self.get_response(request)

# class CompanyMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):

#         public_paths = [
#             "/api/accounts/register/",
#             "/api/accounts/login/",
#             "/api/accounts/forgot-password/",
#         ]

#         if request.path in public_paths:
#             request.company = None
#             return self.get_response(request)

#         if request.user.is_authenticated:
#             request.company = getattr(request.user, "company", None)
#         else:
#             request.company = None

#         return self.get_response(request)