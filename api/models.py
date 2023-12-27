from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(_("email address"), unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    fullname = models.CharField(verbose_name="Full Name", max_length=255 , null=True, blank=True)
    jobtitle = models.CharField(verbose_name="Job Title", max_length=255 , null=True, blank=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

class Runnumber(models.Model):
    form_name = models.CharField(verbose_name="Form Name", max_length=255 , null=True, blank=True)
    running_number =  models.IntegerField(verbose_name="Running Number", null=True, blank=True)
    def __str__(self):
        return self.form_name
