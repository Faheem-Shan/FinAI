from django.contrib.auth.tokens import PasswordResetTokenGenerator

class PasswordResetTokenGeneratorCustom(PasswordResetTokenGenerator):
    pass

password_reset_token = PasswordResetTokenGeneratorCustom()