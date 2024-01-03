from django.conf import settings
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Ememo, FlowEmemo
from django.core.mail import EmailMultiAlternatives, EmailMessage
from django.template.loader import render_to_string
import qrcode
import io
import base64
from django.shortcuts import get_object_or_404
from weasyprint import HTML,  CSS

@receiver(pre_save, sender=Ememo)
def change_step(sender, instance, **kwargs):
     print("Instance Step",instance.step)
     if instance.step == "Drafted":
         print('no action taken')
         return
     flow = FlowEmemo.objects.get(target=instance.step)
     print("Instance target",instance.step)
     if flow.sendEmail :
        print("sennding email")
        to = instance.assignnee.email
        cc = flow.cc or None
        EmailContent = flow.contentEmail or None
        link = settings.FRONTEND_URL+'/dashboard/ememo/'+str(instance.number)
        html_content = render_to_string('email/ememo_email.html',  {'object': instance, 'EmailContent': EmailContent, 'link':link })
        msg = EmailMultiAlternatives(f'Ememo {instance.number} {instance.step} ', 'email plain content', 'ekaluk.pong@yahoo.com',[to], cc)
        msg.attach_alternative(html_content, "text/html")
        if flow.sendPDF:
            print("sennding email with pdf")
            qr = qrcode.QRCode(version=1,error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=2,border=1)
            qr.add_data(settings.FRONTEND_URL+'/dashboard/ememo/'+str(instance.number))

            qr.make(fit=True)
            qr_code_image = qr.make_image(fill_color="black", back_color="white").convert('RGB')
            buffer = io.BytesIO()
            qr_code_image.save(buffer, format="PNG")
            qr_code_image_data = base64.b64encode(buffer.getvalue()).decode()
            object = get_object_or_404(Ememo, number=instance.number )
            rendered  = render_to_string('ememo/ememo_report.html',  {'object':object, 'qr_code_image_data': qr_code_image_data })
            html = HTML(string=rendered, base_url=None)
            pdFile =  html.write_pdf()
            msg.attach(f'ememo_{instance.number}.pdf', pdFile, 'application/pdf')
        return msg.send()





