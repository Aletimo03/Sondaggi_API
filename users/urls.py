# users/urls.py
from django.urls import path
from .views import UserListView, UserMeView,RegisterView

urlpatterns = [
    path('', UserListView.as_view(), name='user-list'),  # Only for admins
    path('me/', UserMeView.as_view(), name='user-me'),   # For regular users
    path('register/', RegisterView.as_view(), name='user-register'),
]
