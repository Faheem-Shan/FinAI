# from sklearn.feature_extraction.text import CountVectorizer
# from sklearn.naive_bayes import MultinomialNB
# from sklearn.linear_model import LinearRegression
# import numpy as np

# def clean_text(text):
#     return text.lower().strip()



# # TEXT CLASSIFICATION (Naive Bayes)


# texts = [
#     # 🔹 PERSONAL
#     "swiggy order", "zomato dinner", "dominos pizza",
#     "uber ride", "ola cab", "bus ticket",
#     "amazon shopping", "flipkart order",
#     "salary credited", "freelance payment",
#     "electricity bill", "internet bill",

#     # 🔹 COMPANY
#     "salary payout to employees", "employee payroll",
#     "office rent paid", "workspace rent",
#     "aws bill", "server cost", "hosting charges",
#     "google ads campaign", "facebook ads",
#     "client payment received", "project income",
#     "zoom subscription", "software subscription",

#     # 🔹 BANK
#     "loan emi paid", "bank emi", "sbi loan", "interest payment",
#     "atm withdrawal", "cash withdrawal",
#     "upi transfer", "bank transfer"
# ]

# labels = [
#     # PERSONAL
#     "food", "food", "food",
#     "transport", "transport", "transport",
#     "shopping", "shopping",
#     "income", "income",
#     "utilities", "utilities",

#     # COMPANY
#     "salary", "salary",
#     "rent", "rent",
#     "infrastructure", "infrastructure", "infrastructure",
#     "marketing", "marketing",
#     "income", "income",
#     "tools", "tools",

#     # BANK
#     "loan", "loan", "loan", "loan",
#     "cash", "cash",
#     "transfer", "transfer"
# ]


# # ==============================
# # 🔹 MODEL TRAINING
# # ==============================

# vectorizer = CountVectorizer(stop_words="english")
# X = vectorizer.fit_transform(texts)

# nb_model = MultinomialNB()
# nb_model.fit(X, labels)


# # ==============================
# # 🔹 CATEGORY FILTER
# # ==============================

# PERSONAL_CATEGORIES = [
#     "food", "transport", "shopping", "income", "utilities", "cash", "transfer"
# ]

# COMPANY_CATEGORIES = [
#     "salary", "rent", "infrastructure", "marketing",
#     "tools", "loan", "income", "transfer"
# ]


# # ==============================
# # 🔹 PREDICTION
# # ==============================

# def predict_category(text, is_company=False):
#     text = clean_text(text)

#     if not text:
#         return "General"

#     test = vectorizer.transform([text])
#     prediction = nb_model.predict(test)[0].lower()

#     # 🔥 CATEGORY FILTER
#     allowed_categories = COMPANY_CATEGORIES if is_company else PERSONAL_CATEGORIES

#     if prediction not in allowed_categories:
#         return "General"

#     return prediction.capitalize()


# # ==============================
# # 🔹 SPENDING PREDICTION
# # ==============================

# def predict_spending(data):
#     if not data or len(data) < 2:
#         return 0

#     # 🔹 Remove outliers (simple)
#     data = sorted(data)
#     if len(data) > 3:
#         data = data[:-1]

#     days = np.array(range(len(data))).reshape(-1, 1)
#     amounts = np.array(data)

#     lr_model = LinearRegression()
#     lr_model.fit(days, amounts)

#     future_day = np.array([[len(data)]])
#     prediction = lr_model.predict(future_day)[0]

#     return round(float(prediction), 2)



from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LinearRegression
import numpy as np


def clean_text(text):
    return text.lower().strip()




texts = [
    "swiggy order", "zomato dinner", "dominos pizza",
    "uber ride", "ola cab", "bus ticket",
    "amazon shopping", "flipkart order",
    "salary credited", "freelance payment",
    "electricity bill", "internet bill",

    "salary payout to employees", "employee payroll",
    "office rent paid", "workspace rent",
    "aws bill", "server cost", "hosting charges",
    "google ads campaign", "facebook ads",
    "client payment received", "project income",
    "zoom subscription", "software subscription",

    "loan emi paid", "bank emi", "sbi loan", "interest payment",
    "atm withdrawal", "cash withdrawal",
    "upi transfer", "bank transfer"
]

labels = [
    "food", "food", "food",
    "transport", "transport", "transport",
    "shopping", "shopping",
    "income", "income",
    "utilities", "utilities",

    "salary", "salary",
    "rent", "rent",
    "infrastructure", "infrastructure", "infrastructure",
    "marketing", "marketing",
    "income", "income",
    "tools", "tools",

    "loan", "loan", "loan", "loan",
    "cash", "cash",
    "transfer", "transfer"
]


# ==============================
# 🔹 MODEL
# ==============================

vectorizer = CountVectorizer(stop_words="english")
X = vectorizer.fit_transform(texts)

nb_model = MultinomialNB()
nb_model.fit(X, labels)


# ==============================
# 🔹 CATEGORY FILTER
# ==============================

PERSONAL_CATEGORIES = [
    "food", "transport", "shopping", "income", "utilities", "cash", "transfer"
]

COMPANY_CATEGORIES = [
    "salary", "rent", "infrastructure", "marketing",
    "tools", "loan", "income", "transfer"
]




def find_best_match(text, user=None, company=None):
    from finance.models import Transaction

    text = clean_text(text)

    query = Transaction.objects.all()

    if company:
        query = query.filter(company=company)
    elif user:
        query = query.filter(user=user)

    best_score = 0
    best_category = None

    for txn in query[:50]:
        if not txn.description or not txn.category:
            continue

        db_text = clean_text(txn.description)

        input_words = set(text.split())
        db_words = set(db_text.split())

        score = len(input_words.intersection(db_words))

        if score > best_score:
            best_score = score
            best_category = txn.category.name

    if best_category and best_score > 0:
        return best_category.lower()

    return None


# ==============================
# 🔹 🔥 UPDATED PREDICTION
# ==============================

def predict_category(text, is_company=False, user=None, company=None):
    text = clean_text(text)

    if not text:
        return "General"

    # 🔥 STEP 1: RAG
    db_result = find_best_match(text, user=user, company=company)

    if db_result:
        return db_result.capitalize()

    # 🔥 STEP 2: ML
    test = vectorizer.transform([text])
    prediction = nb_model.predict(test)[0].lower()

    allowed_categories = COMPANY_CATEGORIES if is_company else PERSONAL_CATEGORIES

    if prediction not in allowed_categories:
        return "General"

    return prediction.capitalize()


# ==============================
# 🔹 SPENDING PREDICTION
# ==============================

def predict_spending(data):
    if not data or len(data) < 2:
        return 0

    data = sorted(data)
    if len(data) > 3:
        data = data[:-1]

    days = np.array(range(len(data))).reshape(-1, 1)
    amounts = np.array(data)

    lr_model = LinearRegression()
    lr_model.fit(days, amounts)

    future_day = np.array([[len(data)]])
    prediction = lr_model.predict(future_day)[0]

    return round(float(prediction), 2)