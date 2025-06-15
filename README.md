# 🗳️ Sondaggi - Full-Stack Polling App

Sondaggi is a full-stack web application where users can register, log in, create polls, vote on them, and view results in real time. It features user authentication via JWT tokens, poll management, and a clean, responsive frontend.

---

## ✨ Features

- ✅ User registration & JWT login system
- 🔒 Token-based authentication with access/refresh support
- 📊 Create, vote, and delete polls
- 🧼 Modal-based feedback with success/failure messages
- 🖥️ Responsive frontend using HTML, CSS, JavaScript
- 🌐 Backend served with Django REST Framework
- ☁️ Easily deployable via [Railway](https://railway.app)

---

## 🏗️ Tech Stack

| Part      | Tech   |
|-----------|--------|
| Backend   | Django + Django REST Framework |
| Frontend  | HTML, CSS, JavaScript |
| Database  | SQLite |
| Deployment | Railway |

---

## 📁 Folder Structure

```

sondaggi/
├── client/
│   ├── index.html
│   ├── createpoll.html
│   ├── polldetail.html
│   ├── login.html
│   ├── register.html
│   └── js/
│       ├── api.js
│       ├── auth.js
│       ├── index.js
│       └── login.js
├── config/
│   └── (Django project settings, urls, wsgi, asgi, etc.)
├── polls/
│   └── (Django app for polls models, views, serializers, urls)
├── users/
│   └── (Django app for user authentication and management)
├── requirements.txt
└── README.md
```


---

## 🧑‍💻 Dev Setup

### 📦 Clone the repository and getting started

```bash 
git clone https://github.com/your-username/sondaggi.git
cd sondaggi

cd backend

python3 -m venv venv

source venv/bin/activate   # Windows: venv\Scripts\activate

pip install -r requirements.txt

#Then: 

# Wipe old data (optional)
rm db.sqlite3
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
python manage.py makemigrations
python manage.py migrate

After running migrations:

python manage.py createsuperuser

#Repeat for multiple admin users.

# Start the server
python manage.py runserver

#Backend will run on http://localhost:8000  

cd ../frontend

You can serve this with Live Server (VS Code), or:

# Simple Python server
python3 -m http.server 3000

Frontend will be available on http://localhost:3000
```

## 📋 Future Improvements
- Add real-time charts for results
- Add pagination/filter for polls
- Enable comment or discussion on polls
- Add user profile pages

# 👨‍💻 Author

### Alessio Timofte