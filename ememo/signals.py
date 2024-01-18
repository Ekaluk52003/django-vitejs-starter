from django.conf import settings
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import Ememo, FlowEmemo
from django.core.mail import EmailMultiAlternatives, EmailMessage
from django.template.loader import render_to_string
import qrcode
import io
import os
import base64
from django.shortcuts import get_object_or_404
from weasyprint import HTML,  CSS
import weasyprint
import boto3

s3 = boto3.client('s3',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )



def url_fetcher(url):
        # image url start with below condition then request presign url
        if url.startswith(f"{os.getenv('FRONTEND_URL')}/api/"):
             splitUrl = url.split("/")
             key =   splitUrl[7]
             bucket_name = os.getenv('AWS_STORAGE_BUCKET_NAME')
             file_name = 'files/ememo/'+key
             response = s3.generate_presigned_url('get_object',
                                                 Params={'Bucket': bucket_name,
                                                         'Key':  file_name},
                                                 ExpiresIn=3600)
             url =  response

             weasyprint.default_url_fetcher(url)
        return  weasyprint.default_url_fetcher(url)



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
        html_content = render_to_string('ememo/Emails/ememo_email.html',  {'object': instance, 'EmailContent': EmailContent, 'link':link })
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
            rendered  = render_to_string('ememo/PDF/ememo_report.html',  {'object':object, 'qr_code_image_data': qr_code_image_data })
            html = HTML(string=rendered, base_url=None, url_fetcher=url_fetcher)
            pdFile =  html.write_pdf()
            msg.attach(f'ememo_{instance.number}.pdf', pdFile, 'application/pdf')
        return msg.send()





