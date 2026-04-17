#  FinAI - Financial Management SaaS

## 📌 Overview

FinAI is a full-stack multi-tenant financial management SaaS application that helps individuals and organizations track transactions, manage budgets, and gain AI-powered financial insights.

---

## 🏢 Key Features

* 🔐 JWT-based Authentication (Login/Register)
* 🏢 Multi-Tenant Architecture (Company-based)
* 👥 Role-Based Access (Admin, Manager, Accountant)
* 💸 Transaction Management (Income & Expense)
* 📊 Budget Tracking
* 🤖 AI-Powered Category Suggestion (FastAPI)
* ⚡ Async Email Handling (Celery + Redis)
* 📈 Dashboard & Insights

---

## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Context API
* React Router

### Backend

* Django
* Django REST Framework (DRF)
* JWT Authentication

### AI Microservice

* FastAPI
* Machine Learning (Category Prediction)

### Async Processing

* Celery
* Redis

---

## 🔁 System Flow

User → React UI → Axios (JWT Token) → Django API
→ Middleware (Company Context) → Database
→ Response → UI Update

---

## 🧠 Architecture Highlights

* Middleware-based multi-tenant handling (`request.company`)
* Role-based UI & backend validation
* Microservice architecture (AI service using FastAPI)
* Clean modular backend apps (`accounts`, `finance`, `tenants`)
* Scalable frontend structure (components + pages + context)

---

## 📂 Project Structure

```
FINANCE/
├── backend/
│   ├── accounts/
│   ├── finance/
│   ├── tenants/
│   ├── core/
│   └── ai-service/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── services/
│
└── README.md
```

---

## 🚀 How to Run the Project

### 🔹 Backend (Django)

```bash
cd backend
pip install -r requirements.txt
python manage.py runserver
```

### 🔹 Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

### 🔹 AI Service (FastAPI)

```bash
cd ai-service
uvicorn main:app --reload
```

---

## 📊 Project Status

✅ Multi-Tenant SaaS Architecture
✅ AI Integration
✅ Async Task Processing
⚠️ Deployment (Docker / CI-CD) Pending

---

## 💡 Future Improvements

* Docker Deployment
* CI/CD Pipeline
* Automated Testing (Pytest)
* Advanced Tenant Isolation

---

## 👨‍💻 Author

Faheem Shan K A
