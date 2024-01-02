from ninja import Router
from django.template.loader import render_to_string
from weasyprint import HTML,  CSS
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from ememo.models import Ememo
import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.template import Context
import qrcode
from qrcode.image.pil import PilImage
from PIL import Image
import io
import base64
import pyqrcode

router = Router()


@router.get("/hello")
def hello(request):
    return "Hello world"

@router.get("/report/{pk}")
def create_pdf(request,  pk: int):

     qr = qrcode.QRCode(version=1,error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=2,border=1)
     qr.add_data("https://www.sanook.com/campus/1404076/")
     qr.make(fit=True)
     qr_code_image = qr.make_image(fill_color="black", back_color="white").convert('RGB')
            # Create a BytesIO buffer to temporarily store the image
     buffer = io.BytesIO()
     qr_code_image.save(buffer, format="PNG")
     qr_code_image_data = base64.b64encode(buffer.getvalue()).decode()


     object = get_object_or_404(Ememo, number=pk )
     rendered  = render_to_string('ememo_report.html',  {'object':object, 'qr_code_image_data': qr_code_image_data})
     html = HTML(string=rendered, base_url=request.build_absolute_uri())
     css = CSS(string='''
    body,  html  {
        font-family: 'ui-sans-serif';

    }
    h1 { font-family: 'ui-sans-serif';
                   }''')

     pdf =  html.write_pdf(stylesheets=[css])
     response = HttpResponse(pdf)
     response['Content-Type'] = 'application/pdf'
     response['Content-Disposition'] = 'inline; filename="{}.pdf"'.format('abc')
     return response


# https://studygyaan.com/django/how-to-generate-a-qr-code-in-django svg image
# https://stackoverflow.com/questions/63226626/how-to-render-an-svg-image-from-an-svg-byte-stream svg
@router.get("/email/{pk}")
def create_pdf_email(request,  pk: int):
    qr = qrcode.QRCode(version=1,error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=2,border=1)
    qr.add_data("https://www.sanook.com/campus/1404076/")
    qr.make(fit=True)
    qr_code_image = qr.make_image(fill_color="black", back_color="white").convert('RGB')
            # Create a BytesIO buffer to temporarily store the image
    buffer = io.BytesIO()
    qr_code_image.save(buffer, format="PNG")
    qr_code_image_data = base64.b64encode(buffer.getvalue()).decode()
    object = get_object_or_404(Ememo, number=pk )


    rendered  = render_to_string('ememo_report.html',  {'object':object, 'qr_code_image_data': qr_code_image_data })
    html = HTML(string=rendered, base_url=None)

    pdFile =  html.write_pdf()
    # text_content = get_template("ememo_email.html").render()
    html_content = render_to_string('ememo_email.html',  {'object':object, 'qr_code_image_data': qr_code_image_data })
    msg = EmailMultiAlternatives(f'Ememo {pk}', f'Ememo {pk}', 'Website <ekaluk.pong@yahoo.com>', ['paxav43152@vasteron.com'], headers = {'Reply-To': 'admin@example.com'})
    msg.attach_alternative(html_content, "text/html")
    msg.attach(f'ememo_{pk}.pdf', pdFile, 'application/pdf')
    msg.send()
    return {"message": "email was sent with report"}
