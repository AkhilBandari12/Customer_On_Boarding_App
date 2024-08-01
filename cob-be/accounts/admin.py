from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(User)
admin.site.register(Plan)
admin.site.register(Client)
admin.site.register(Modules)
admin.site.register(Roles)
admin.site.register(Notification)