from django_cron import CronJobBase, Schedule
from ememo.models import SNS, Crontable
from django.utils import timezone


def cron_test():
    print('running cron job')   # do your thing here
    newTex = Crontable.objects.create(text="cron fron django cron")
    newTex.save()