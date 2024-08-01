from rest_framework import permissions
from .models import Roles

class HasModulePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if user.is_authenticated:
            try:
                role = Roles.objects.get(name=user.role)
                permissions = role.permissions
                module_name = view.get_module_name().lower()
                print(module_name)
                if module_name in permissions:
                    allowed_actions = [perm.lower() for perm in permissions[module_name]]
                    print(allowed_actions)
                    return request.method.lower() in allowed_actions
                else:
                    return False
            except Roles.DoesNotExist:
                return False
        return False
    





























    # class CustomFunctionPermission(permissions.BasePermission):
#     def has_permission(self, request, view):
#         if request.user.is_authenticated:
#             try:
#                 user = request.user
#                 role = Roles.objects.get(name=user.role)
#                 permissions = role.permissions
#                 module_name = getattr(view, 'module_name', '').lower()
#                 if module_name in permissions:
#                     allowed_actions = permissions[module_name]
#                     print(allowed_actions)
#                     # Get the name of the method being accessed
#                     method_name = request.method.lower()
#                     print(method_name)
#                     # Check if the requested method is allowed
#                     if method_name in allowed_actions:
#                         return True
#                 return False  # Method not allowed for the module
#             except Roles.DoesNotExist:
#                 return False  # Role not found
#         return False  # User not authenticated or role not defined


# class HasModulePermission(permissions.BasePermission):
#     def has_permission(self, request, view):
#         user = request.user
#         if user.role:
#             try:
#                 role = Roles.objects.get(name=user.role)
#                 permissions = role.permissions
#                 module_name = view.get_module_name().lower()
#                 if module_name in permissions:
#                     allowed_actions = [perm.lower() for perm in permissions[module_name]]
#                     return request.method.lower() in allowed_actions
#                 else:
#                     return False
#             except Roles.DoesNotExist:
#                 return False
#         return False
