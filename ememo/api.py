from django.shortcuts import get_object_or_404
from ninja import Router
from django.conf import settings
from ninja.security import django_auth
from django.contrib.auth import get_user_model, update_session_auth_hash
from django.contrib.auth.tokens import default_token_generator
from typing import List
from ninja import NinjaAPI, ModelSchema, Schema, UploadedFile, Form, File
from .models import Ememo, FlowEmemo, Log, EmemoMedia
from ninja.security import django_auth
from api.models import CustomUser, Runnumber
from datetime import datetime
from django.db.models import Q
from django.core.paginator import Paginator
from ninja.errors import HttpError
import boto3
import os
from django.http import HttpResponse


# class EmemoSchema(ModelSchema):
#     class Config:
#         model = Ememo
#         model_fields = "__all__"
#         # model_exclude = ['assignnee','file','author', 'id', 'created_at', 'updated_at']
#         model_exclude = ['assignnee', 'author',
#                          'number' 'created_at', 'updated_at']


class EmemoIn(Schema):
    title: str
    content: str


class Message(Schema):
    message: str


class UserSchema(Schema):
    id: int
    fullname: str = None
    jobtitle: str = None
    email:str = None


class EmemoSchemaIn(Schema):

    title: str
    content: str
    reviewer_id:  str = None
    approver_id:   str = None
    # reviewer:  UserSchema = None


class EmemoOut(Schema):
    id: int
    number: int = None
    title: str
    content: str
    author:  UserSchema = None
    reviewer:  UserSchema = None
    approver:  UserSchema = None
    assignnee:  UserSchema = None
    step: str
    created_at: datetime
    updated_at: datetime


class EmemoOutPaginate(Schema):
    id: int
    title: str
    number: int
    content: str
    step: str
    author:  UserSchema = None
    assignnee:  UserSchema = None
    created_at: datetime
    updated_at: datetime


class Emedia(Schema):
    file_url: str
    id: str
    filename: str


class LogSchema(Schema):
    id: int
    description: str
    comment: str
    logBy: UserSchema = None
    created_at: datetime


class PaginatedEmemo(Schema):
    total_ememos: int
    total_pages: int
    per_page: int
    has_next: bool
    has_previous: bool
    results: List[EmemoOutPaginate] = None


router = Router()
_TGS = ['Ememo']


class Comment(Schema):
    comment: str = None


class emomoUpdate(Schema):
    title: str
    content: str


@router.put('/approve/{ememo_id}', auth=django_auth)
def approve(request, payload: Comment, ememo_id: int):
    ememo = get_object_or_404(Ememo, number=ememo_id)

    if request.auth.id != ememo.assignnee_id:
        return 401, {'message': 'You are not assigned to this'}
    try:
        flow = FlowEmemo.objects.get(source=ememo.step)
    except FlowEmemo.DoesNotExist as e:
        return 401, {'message': 'Cannot complete the approve action'}

    ememo.step = flow.target
    if flow.target == "Drafted":
        ememo.assignnee = ememo.author
    if flow.target == "PRE_APPROVE":
        ememo.assignnee = ememo.reviewer
    if flow.target == "FINAL_APPROVE":
        ememo.assignnee = ememo.approver
    if flow.target == "DONE":
        ememo.assignnee = None
    ememo.save()

    log = Log()
    log.comment = payload.comment or None
    log.description = f"change status from {flow.source} to {flow.target} ✔️"
    log.logBy = request.auth
    log.ememo = ememo
    log.save()
    return 200, {'message': 'approve success'}


@router.put('/reject/{ememo_id}', auth=django_auth,  response={200: Message, 401: Message})
def reject(request, payload: Comment, ememo_id: int):

    ememo = get_object_or_404(Ememo, number=ememo_id)

    if request.auth.id != ememo.assignnee_id and request.auth.id != ememo.author_id:
        return 401, {'message': 'You are not authorize'}
    try:
        flow = FlowEmemo.objects.get(source=ememo.step)
    except FlowEmemo.DoesNotExist:
        return 401, {'message': 'Cannot complete the reject action'}
    if flow.can_reject == False:
        return 401, {'message': 'You cannot reject'}
    ememo.assignnee = ememo.author
    ememo.step = "Reject"
    ememo.save()
    log = Log()
    log.comment = payload.comment
    log.description = "Your request is rejected ❌"
    log.logBy = request.auth
    log.ememo = ememo
    log.save()
    return 200, {'message': 'reject success'}


@router.put('/revert/{ememo_id}', auth=django_auth,  response={200: Message, 401: Message})
def revert(request, payload: Comment, ememo_id: int):
    ememo = get_object_or_404(Ememo, id=ememo_id)
    if request.auth != ememo.assignnee:
        return 401, {'message': 'You are not assigned to this'}
    flow = FlowEmemo.objects.get(source=ememo.step)
    if flow.can_revert == False:
        return 401, {'message': 'You cannot revert'}
    ememo.assignnee = ememo.author
    ememo.step = "Drafted"
    ememo.save()
    log = Log()
    log.comment = payload.comment or None
    log.description = "Your request is reverted"
    log.logBy = request.auth
    log.ememo = ememo
    log.save()
    return 200, {'message': 'revert success'}


@router.post("/create", auth=django_auth)
def create_ememo(request, data: EmemoSchemaIn = Form(...), files: List[UploadedFile] = None):

    run_number = Runnumber.objects.filter(form_name="ememo").get()
    ememo_created = Ememo.objects.create(title=data.title, content=data.content,  reviewer_id=data.reviewer_id, number=run_number.running_number,
                                         approver_id=data.approver_id, assignnee_id=request.auth.id, author_id=request.auth.id)

    run_number.running_number = run_number.running_number + 1
    run_number.save()

    if files is not None:
        for file in files:
            EmemoMedia.objects.create(ememo=ememo_created, file_url=file)

    return {"number":  ememo_created.number}


@router.get("/{ememo_id}", auth=django_auth, response={200: EmemoOut, 401: Message, 404: Message})
def getEmemo(request, ememo_id: int):
    try:
        ememo = Ememo.objects.select_related(
            'author', 'reviewer', 'approver', 'assignnee').get(number=ememo_id)

    except Ememo.DoesNotExist as e:
        return 404, {'message': 'Could not find ememo'}

    if request.user.groups.filter(name="Manager").exists():
        return 200, ememo

    if request.auth != ememo.assignnee and request.auth != ememo.author and request.auth != ememo.reviewer and request.auth != ememo.approver:
        return 401, {'message': 'Unauthorized'}
    return 200, ememo


@router.delete("/media/delete/{media_id}", auth=django_auth, response={200: Message, 404: Message})
def delete_media(request, media_id: int):
    try:
        track = EmemoMedia.objects.get(pk=media_id)
        track.delete()
        return 200, {"message": "delete success"}
    except EmemoMedia.DoesNotExist as e:
        return 404, {"message": "Could not find media"}


@router.get("/media/{ememo_id}", auth=django_auth, response=List[Emedia])
def ememo_media(request, ememo_id: int):
    media = EmemoMedia.objects.filter(ememo__number=ememo_id)

    return 200, media

@router.get("/presigned_media/{key}", auth=django_auth)
def ememo_signed_media(request, key: str):

    s3 = boto3.client('s3',
        aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
    )
    obj = s3.get_object(
        Bucket=os.getenv('AWS_STORAGE_BUCKET_NAME'),
        # Key='files/'+key
        Key='files/ememo/'+key
    )

    # response['Content-Type'] = 'application/pdf'
    # response['Content-Disposition'] = 'inline; filename="{}.pdf"'.format('abc')

    # response = HttpResponse(obj['Body'].read())
    # response['Content-Disposition'] = f'attachment; filename="{key}"'

    response = HttpResponse(obj['Body'])

    type = obj['ResponseMetadata']['HTTPHeaders']['content-type']
    print('cehck type', type)
    if type == 'application/pdf' or type == 'text/html' :
        print('hit this pdf/html')
        response['Content-Type'] = obj['ResponseMetadata']['HTTPHeaders']['content-type']
        response['Content-Disposition'] = 'inline; filename="{key}"'
        return response
    if type == 'image/png' or type == 'image/jpeg' or type =='image/png' or type =='image/webp' or type == 'image/jpg':
        print('hit this img')
        response['Content-Type'] = obj['ResponseMetadata']['HTTPHeaders']['content-type']
        response['Content-Disposition'] = 'inline; filename="{key}"'
        return response

    else:
        print('not the right type')
        response['Content-Disposition'] = f'attachment; filename="{key}"'
        return response



@router.get("/log/{ememo_id}", auth=django_auth, response=List[LogSchema])
def ememo_log(request, ememo_id: int):
    log = Log.objects.filter(ememo__number=ememo_id).order_by('-created_at')

    return 200, log


@router.put("/update/{ememo_id}")
def update_ememo(request, ememo_id: int,  form: EmemoSchemaIn = Form(...), files: List[UploadedFile] = None):

    try:
        ememo_update = Ememo.objects.get(number=ememo_id)
    except Ememo.DoesNotExist as e:
        return 404, {"message": "Could not find Ememo"}

    ememo_update.title = form.title
    ememo_update.content = form.content
    ememo_update.reviewer_id = form.reviewer_id
    ememo_update.approver_id = form.approver_id

    if files is not None:
        for file in files:
            EmemoMedia.objects.create(ememo=ememo_update, file_url=file)

    ememo_update.save()
    return {"number": ememo_update.number}


@router.post("/media/new/{ememo_id}", auth=django_auth)
def create_media(request, ememo_id: int, file: UploadedFile):
    EmemoMedia.objects.create(ememo_id=ememo_id, file_url=file)

    return {"success upload": True}


@router.get("/pagination/allememo", auth=django_auth, response=PaginatedEmemo)
def allmemo(request, perpage: int = 2, term='', me="me", page: int = 1):

    if me:
        print('true me')
        ememos = Ememo.objects.filter(assignnee_id=request.auth.id).exclude(
            step="DONE").order_by('-created_at')
        paginator = Paginator(ememos, perpage)
        page_number = page
        page_object = paginator.get_page(page_number)
        response = {}
        response["total_ememos"] = page_object.paginator.count
        response["total_pages"] = page_object.paginator.num_pages
        response["per_page"] = page_object.paginator.per_page
        response["has_next"] = page_object.has_next()
        response["has_previous"] = page_object.has_previous()
        response["results"] = [
            i for i in page_object.object_list.select_related('author', 'assignnee')]
        return response
#  manager = request.user.groups.filter(name="Manager").exists()
    elif request.user.groups.filter(name="Manager").exists():
        print('true manager')
        ememos = Ememo.objects.filter(Q(content__icontains="try once more") | Q(
            title__icontains=term)).order_by('-created_at')
        paginator = Paginator(ememos, perpage)
        page_number = page
        page_object = paginator.get_page(page_number)
        response = {}
        response["total_ememos"] = page_object.paginator.count
        response["total_pages"] = page_object.paginator.num_pages
        response["per_page"] = page_object.paginator.per_page
        response["has_next"] = page_object.has_next()
        response["has_previous"] = page_object.has_previous()
        response["results"] = [
            i for i in page_object.object_list.select_related('author', 'assignnee')]
        return response

    else:
        print('true else')
        ememos = Ememo.objects.filter(Q(content__icontains=term) | Q(title__icontains=term), Q(assignnee_id=request.auth.id) | Q(
            reviewer_id=request.auth.id) | Q(approver_id=request.auth.id) | Q(author_id=request.auth.id)).order_by('-created_at')
        paginator = Paginator(ememos, perpage)
        page_number = page
        page_object = paginator.get_page(page_number)
        response = {}
        response["total_ememos"] = page_object.paginator.count
        response["total_pages"] = page_object.paginator.num_pages
        response["per_page"] = page_object.paginator.per_page
        response["has_next"] = page_object.has_next()
        response["has_previous"] = page_object.has_previous()
        response["results"] = [
            i for i in page_object.object_list.select_related('author', 'assignnee')]
        return response
