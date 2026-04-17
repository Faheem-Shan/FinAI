from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Company,CompanyUser

admin.site.register(Company)
admin.site.register(CompanyUser)