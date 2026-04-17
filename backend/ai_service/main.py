from fastapi import FastAPI
from ml_model import predict_category,predict_spending
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

import sys
import os
import django

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth import get_user_model
from tenants.models import Company

User = get_user_model()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 REQUEST MODELS

class CategoryRequest(BaseModel):
    description: str
    user_id: Optional[int] = None
    company_id: Optional[int] = None


class SpendingRequest(BaseModel):
    amounts: List[float]


#Routes

@app.get("/")
def home():
    return {"message": "AI Service Running "}

@app.post("/predict-category")
def category(data: CategoryRequest):

    user = None
    company = None

    # 🔥 Fetch user (optional)
    if data.user_id:
        try:
            user = User.objects.get(id=data.user_id)
        except User.DoesNotExist:
            pass

    # 🔥 Fetch company (optional)
    if data.company_id:
        try:
            company = Company.objects.get(id=data.company_id)
        except Company.DoesNotExist:
            pass

    result = predict_category(
        data.description,
        is_company=bool(company),
        user=user,
        company=company
    )

    return {"category": result}



@app.post("/predict-spending")
def spending(data: SpendingRequest):
    result = predict_spending(data.amounts)
    return {"prediction": result}