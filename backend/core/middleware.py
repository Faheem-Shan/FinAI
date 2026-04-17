class CompanyMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            request.company = request.user.company
        else:
            request.company = None

        return self.get_response(request)