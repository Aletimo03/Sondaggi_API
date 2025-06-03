# users/permissions.py
from rest_framework.permissions import BasePermission

class IsSuperUserOrAnonymous(BasePermission):
    """
    Allow access only to anonymous users or superusers.
    """
    def has_permission(self, request, view):
        return not request.user.is_authenticated or request.user.is_superuser
