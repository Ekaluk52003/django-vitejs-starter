from ninja import Router
from django.template.loader import render_to_string
from weasyprint import HTML
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from ememo.models import Ememo
import logging
import os
from django.conf import settings

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

