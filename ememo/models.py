from django.db import models
from .validators import validate_file_size
from api.models import CustomUser




Step = (
          ("Drafted", "Drafted"),
           ("Reject", "Reject"),
            ("Cancel", "Cancel"),
          ("PRE_APPROVE", "PRE_APPROVE"),
          ("FINAL_APPROVE", "FINAL_APPROVE"),
          ("DONE", "DONE"),
)

class Ememo(models.Model):
    title = models.CharField(verbose_name="Title", max_length=255)
    content = models.TextField(verbose_name="Content")
    number = models.IntegerField(verbose_name="Number")
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    reviewer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviewer', null=True, blank=True)
    approver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='approver', null=True, blank=True)
    assignnee = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='assignnee', null=True, blank=True)
    step =  models.CharField(max_length=13, choices=Step, default='Drafted')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
      return str(self.pk) + '-' + self.title

class EmemoMedia(models.Model):
    ememo = models.ForeignKey(
        Ememo,
        on_delete=models.CASCADE,
        related_name="media",
    )
    file_url =  models.FileField(upload_to='files/ememo/', blank=True, null=True, validators=[validate_file_size])

    created_at = models.DateTimeField(
        auto_now_add=True,
        editable=False,
    )
    updated_at = models.DateTimeField(
        auto_now=True,
    )
    def delete(self, *arg, **kwargs):
       self.file_url.delete()
       super().delete(*arg, **kwargs)

class FlowEmemo(models.Model):
    source =  models.CharField(max_length=13, choices=Step)
    target =  models.CharField(max_length=13, choices=Step)
    moderator =  models.CharField(max_length=13, default='reviewer', blank=True, null=True,)
    # emailTo =  models.CharField(max_length=13, default='reviewer', blank=True, null=True,)
    can_revert = models.BooleanField(default=True, blank=True, null=True,)
    can_reject = models.BooleanField(default=True, blank=True, null=True,)

    def __str__(self):
      return self.source + '->' + self.target + '->' + self.moderator

class Log(models.Model):

    description = models.TextField(verbose_name="Description" , blank=True, null=True)
    comment = models.TextField(verbose_name="Comment", blank=True, null=True)
    ememo =   models.ForeignKey(Ememo, on_delete=models.CASCADE, related_name='log')
    logBy =   models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
      return self.description