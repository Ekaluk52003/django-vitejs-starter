from django.contrib import admin
from .models import Ememo, FlowEmemo, Log, EmemoMedia
from django.forms import TextInput, Textarea
from django.db import models
# Register your models here.


class FlowAdmin(admin.ModelAdmin):

      list_display = ("source", "target","can_reject", "sendEmail", "sendPDF","cc", "contentEmail")
admin.site.register(FlowEmemo, FlowAdmin)

class EmemoAdmin(admin.ModelAdmin):
    list_display = ("number","title", "content","step","assignnee","reviewer","approver","assignnee")
admin.site.register(Ememo,  EmemoAdmin)

class LogAdmin(admin.ModelAdmin):
     list_display = ("description", "comment", "logBy", "ememo")
admin.site.register(Log, LogAdmin)

class EmemoMediaAdmin(admin.ModelAdmin):
     list_display = ("ememo", "file_url")
admin.site.register(EmemoMedia, EmemoMediaAdmin)