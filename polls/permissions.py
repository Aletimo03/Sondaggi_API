from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow read-only for everyone
        if request.method in permissions.SAFE_METHODS:
            return True

        # Allow superusers to edit/delete anything
        if request.user.is_superuser:
            return True

        # If it's a Poll, check directly
        if hasattr(obj, 'created_by'):
            return obj.created_by == request.user

        # If it's a Choice, check the related poll's owner
        if hasattr(obj, 'poll') and hasattr(obj.poll, 'created_by'):
            return obj.poll.created_by == request.user

        # Default: deny
        return False
