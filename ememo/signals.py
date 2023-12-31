from django.conf import settings
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Ememo, FlowEmemo


# @receiver(pre_save, sender=Ememo)
# def change_step(sender, instance, **kwargs):
#      print('print from signal', instance.step)
#      if instance.step == "PRE_APPROVE" :
#           print('sending email to f{instance.reviewer}')







    #  email = instance.who
    #  print(email)





#     if instance.action == "Approve" :

#         print("step ememo",instance.step)
#         print("flow target",flow.target)
#         instance.step = flow.target

#         # variable = exec("reviewer")
#         if flow.target == "PRE_APPROVE" :
#           instance.assignnee = instance.reviewer
#         if flow.target == "FINAL_APPROVE" :
#           instance.assignnee = instance.approver
#         if flow.target == "DONE" :
#           instance.assignnee = None