from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.admin import SimpleListFilter
from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser, Runnumber
from django.contrib.auth.models import Group

class GroupListFilter(SimpleListFilter):
    title = ('group my')
    parameter_name = 'group'
    def lookups(self, request, model_admin):
        items = ()
        for group in Group.objects.all():
            items += ((str(group.id), str(group.name),),)
        return items
    def queryset(self, request, queryset):
        group_id = request.GET.get(self.parameter_name, None)
        if group_id:
            return queryset.filter(groups=group_id)
        return queryset


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    def group_name(self, obj):
        """
        get group, separate by slash, and display empty string if user has no group
        """
        return '/'.join([g.name for g in obj.groups.all()]) if obj.groups.count() else ''

    list_display = ("email", "fullname",  "is_staff", "is_superuser","is_active","group_name")
    list_filter = ("email", "is_staff", "is_active")
    list_filter = UserAdmin.list_filter + (GroupListFilter,)

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ('Profile',{'fields': ('fullname','jobtitle')}),
        ("Permissions", {"fields": ("is_staff", "is_superuser","is_active","groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": (
                "email", "password1", "password2", "jobtitle","fullname","is_staff",
                "is_active", "groups", "user_permissions", "is_staff", "is_superuser"
            )}
        ),
    )
    search_fields = ("email","fullname")
    ordering = ("email","fullname")


admin.site.register(CustomUser, CustomUserAdmin)

class RunnumberAdmin(admin.ModelAdmin):
    list_display = ("form_name", "running_number")
admin.site.register(Runnumber,  RunnumberAdmin)