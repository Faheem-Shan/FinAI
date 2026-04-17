from django.db import models

class Company(models.Model):
    name = models.CharField(max_length=100)
    domain = models.CharField(max_length=100, unique=True)
    max_users = models.IntegerField(default=1000)

    def __str__(self):
        return self.name
    
class CompanyUser(models.Model):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("manager", "Manager"),
        ("accountant", "Accountant"),
    )
     
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="accountant")
    
    def __str__(self):
        return f"{self.email} - {self.company.name}"