from django.db import models
import os
from uuid import uuid4
from django_fsm import FSMField, transition




def file_generate_upload_path(instance, filename):
	# extentention of file
    ext = filename.split('.')[-1]
    # filename = '{}.{}'.format(instance.title, ext)
    # filename
    filename = "%s_%s.%s" % ('Django',instance.title, ext)

    return f"files/{filename}"

class Note(models.Model):

    state = FSMField(default="green", protected=True)
    title = models.CharField(max_length=100)
    content = models.CharField(max_length=100)
    photo = models.FileField(
        upload_to=file_generate_upload_path,
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class TrafficLight(models.Model):
    state = FSMField(default="green", protected=True)

    @transition(field=state, source="green", target="yellow")
    def to_state_yellow(self):
        return "Light switched to yellow!"

    @transition(field=state, source="yellow", target="red")
    def to_state_red(self):
        return "Light switched to red!"

    @transition(field=state, source="red", target="green")
    def to_state_green(self):
        return "Light switched to green!"