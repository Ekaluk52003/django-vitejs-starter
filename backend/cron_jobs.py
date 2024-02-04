
from django_cron import CronJobBase, Schedule
from ememo.models import SNS,Crontable
from django.utils import timezone

class MyCronJob(CronJobBase):
    RUN_EVERY_MINS = 1 # every 2 hours

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'cron.MyCronJob'    # a unique code

    def do(self):
        print('running cron')   # do your thing here
        Crontable.objects.create(text="run another cron")
        # twele_hour_ago = timezone.now() - timezone.timedelta(hours=12)
        # expired_logs = SNS.objects.filter(
        # created_at__lte=twele_hour_ago
        # )
        # expired_logs.delete()