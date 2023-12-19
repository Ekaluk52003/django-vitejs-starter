from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    list_display = ("email", "fullname",  "is_staff", "is_active",)
    list_filter = ("email", "is_staff", "is_active",)
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ('Profile',{'fields': ('fullname','jobtitle')}),
        ("Permissions", {"fields": ("is_staff", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email", "password1", "password2", "jobtitle","fullname","is_staff",
                "is_active", "groups", "user_permissions",
            )}
        ),
    )
    search_fields = ("email","fullname")
    ordering = ("email","fullname")


admin.site.register(CustomUser, CustomUserAdmin)