from django.db import models

from django_fsm import FSMField, transition

class Note(models.Model):
    state = FSMField(default="green", protected=True)
    title = models.CharField(max_length=100)
    content = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='images/', null=True)
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