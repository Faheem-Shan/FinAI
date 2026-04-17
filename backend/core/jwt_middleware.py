# import jwt
# from urllib.parse import parse_qs
# from channels.db import database_sync_to_async
# from django.conf import settings
# from django.contrib.auth import get_user_model
# from rest_framework_simplejwt.tokens import AccessToken

# User = get_user_model()


# # 🔹 Get user from token
# @database_sync_to_async
# def get_user_from_token(token):
#     try:
#         access_token = AccessToken(token)
#         user_id = access_token["user_id"]
#         return User.objects.get(id=user_id)
#     except Exception:
#         return None


# # 🔹 Custom JWT Middleware
# class JWTAuthMiddleware:
#     def __init__(self, inner):
#         self.inner = inner

#     async def __call__(self, scope, receive, send):

#         # 🔹 Get query string
#         query_string = scope.get("query_string", b"").decode()
#         query_params = parse_qs(query_string)

#         token = query_params.get("token")

#         if token:
#             token = token[0]
#             user = await get_user_from_token(token)
#             scope["user"] = user
#         else:
#             scope["user"] = None

#         return await self.inner(scope, receive, send)


# # 🔹 Middleware Stack (like AuthMiddlewareStack)
# def JWTAuthMiddlewareStack(inner):
#     return JWTAuthMiddleware(inner)

import jwt
from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()


# 🔹 Get user from token
@database_sync_to_async
def get_user_from_token(token):
    try:
        access_token = AccessToken(token)
        user_id = access_token["user_id"]
        return User.objects.get(id=user_id)
    except Exception:
        return None


# 🔹 Custom JWT Middleware
class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):

        # 🔹 Get query string
        query_string = scope.get("query_string", b"").decode()
        query_params = parse_qs(query_string)

        token = query_params.get("token")

        if token:
            token = token[0]
            user = await get_user_from_token(token)
            scope["user"] = user
        else:
            scope["user"] = None

        return await self.inner(scope, receive, send)


# 🔹 Middleware Stack (like AuthMiddlewareStack)
def JWTAuthMiddlewareStack(inner):
    return JWTAuthMiddleware(inner)