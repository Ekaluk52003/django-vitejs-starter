from ninja import NinjaAPI, Schema, File, Form
from ninja.files import UploadedFile
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from ninja.security import django_auth
from datetime import date
from note.models import Note, TrafficLight
from weasyprint import HTML
from django.http import FileResponse
from django.template.loader import render_to_string
import io
from django.http import HttpResponse
from ninja_auth.api import router as auth_router
from api.models import CustomUser
from django.core.paginator import Paginator
from typing import List, Any
import math


api = NinjaAPI(csrf=True)

api.add_router('/auth/', auth_router)
class HelloSchema(Schema):
    name: str = "world"

class TrafficLightIn(Schema):
    state: str


class NoteIn(Schema):
    title: str
    content: str
    created_at: date = None
    updated_at:date = None


class PaginatedNote(Schema):
    total_notes: int
    total_pages: int
    per_page : int
    has_next: bool
    has_previous: bool
    results: List[NoteIn] = None

@api.get("/paginate-notes",response=PaginatedNote)
def list_notes(request,page:int=1):
    notes = Note.objects.all()
    paginator = Paginator(notes,2)
    page_number = page
    page_object = paginator.get_page(page_number)
    response = {}
    response["total_notes"] = page_object.paginator.count
    response["total_pages"] = page_object.paginator.num_pages
    response["per_page"] = page_object.paginator.per_page
    response["has_next"] = page_object.has_next()
    response["has_previous"] = page_object.has_previous()
    response["results"] = [i for i in page_object.object_list.values()]
    return response



@api.get("/hello")
def hello(request):
    return f"Authenticated user name {request.user.date_joined}"




@api.post("/note", auth=django_auth)
def create_note(request, payload: NoteIn):
    note = Note.objects.create(**payload.dict())
    return {"id": note.id}

@api.post("/yellowlight/{pk}", auth=django_auth)
def changeToYellow(request, payload: TrafficLightIn, pk: int):
    light =  TrafficLight.objects.get(pk=pk)
    light.to_state_yellow()
    light.save()
    return {"id": light.state}

@api.post("/redlight/{pk}", auth=django_auth)
def changeToRed(request, payload: TrafficLightIn, pk: int):
    light =  TrafficLight.objects.get(pk=pk)
    light.to_state_red()
    light.save()
    return {"id": light.state}

@api.post("/greenlight/{pk}", auth=django_auth)
def changeToGreen(request, payload: TrafficLightIn, pk: int):
    light =  TrafficLight.objects.get(pk=pk)
    light.to_state_green()
    light.save()
    return {"id": light.state}

@api.get("/light/{pk}", auth=django_auth)
def getLight(request, pk: int):
    obj =  TrafficLight.objects.get(pk=pk)
    transitions = list(obj.get_available_state_transitions())
    print('transition', transitions[0].target)
    return {"id":  obj.state}



@api.post("/upload-note")
def upload_note(request,  title : str = Form(...), content : str = Form(...), file: UploadedFile = File(...)):
    note = Note.objects.create(title=title, content=content, photo=file)
    return {"id": note.id}


# @api.get("/pdf")
# def create_pdf(request):
#     buffer = io.BytesIO()
#     html = render_to_string('person_report.html')
#     pdf = weasyprint.HTML(string=html, base_url=None)
#     pdf.write_pdf(buffer)
#     buffer.seek(0)

    # response = HttpResponse(buffer, content_type ='application/force-download')
    # return FileResponse(buffer, as_attachment=True, filename="test.pdf")

    # response['Content-Disposition'] = "attachment; filename=" + 'sample' + '.' + "pdf"
    # # response['Access-Control-Expose-Headers'] = 'Content-Disposition'
    # return response

@api.get("/pdf")
def create_pdf(request):
    rendered  = render_to_string('person_report.html')
    html = HTML(string=rendered, base_url=None)
    pdf =  html.write_pdf()
    response = HttpResponse(pdf)
    response['Content-Type'] = 'application/pdf'
    response['Content-Disposition'] = 'inline; filename="{}.pdf"'.format('abc')
    return response