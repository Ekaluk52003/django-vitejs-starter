from ninja import Router
from django.template.loader import render_to_string
from weasyprint import HTML
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from ememo.models import Ememo
import logging
import os
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.template import Context

router = Router()


# class TrafficLightIn(Schema):
#     state: str

@router.get("/hello")
def hello(request):
    return "Hello world"

@router.get("/report/{pk}")
def create_pdf(request,  pk: int):

    object = get_object_or_404(Ememo, number=pk )
    rendered  = render_to_string('ememo_report.html',  {'object':object})
    html = HTML(string=rendered, base_url=None)

    pdf =  html.write_pdf()
    response = HttpResponse(pdf)
    response['Content-Type'] = 'application/pdf'
    response['Content-Disposition'] = 'inline; filename="{}.pdf"'.format('abc')
    return response


# https://gist.github.com/LowerDeez/9a8b30428a96c4b965d059925a7bd659
@router.get("/email/{pk}")
def create_pdf_email(request,  pk: int):
    print('sending report')
    object = get_object_or_404(Ememo, number=pk )
    rendered  = render_to_string('ememo_report.html',  {'object':object})
    html = HTML(string=rendered, base_url=None)

    pdFile =  html.write_pdf()
    # text_content = get_template("ememo_email.html").render()
    html_content = render_to_string('ememo_email.html',  {'object':object})
    msg = EmailMultiAlternatives(f'Ememo {pk}', f'Ememo {pk}', 'Website <ekaluk.pong@yahoo.com>', ['ekaluk.pong@yahoo.com'], headers = {'Reply-To': 'admin@example.com'})
    msg.attach_alternative(html_content, "text/html")
    msg.attach(f'ememo_{pk}.pdf', pdFile, 'application/pdf')
    msg.send()
    return {"message": "email was sent with report"}

