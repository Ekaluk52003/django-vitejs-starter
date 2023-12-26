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
from api.models import CustomUser
from datetime import datetime
from django.db.models import Q
from django.core.paginator import Paginator


class EmemoSchema(ModelSchema):
    class Config:
        model = Ememo
        model_fields = "__all__"
        # model_exclude = ['assignnee','file','author', 'id', 'created_at', 'updated_at']
        model_exclude = ['assignnee', 'author',
                         'id', 'created_at', 'updated_at']


class EmemoSchemaIn(Schema):

    title: str
    content: str
    reviewer_id:  str = None
    approver_id:   str = None


class EmemoIn(Schema):
    title: str
    content: str


class Message(Schema):
    message: str


class UserSchema(Schema):
    id: int
    fullname: str


class EmemoOut(Schema):
    id: int
    title: str
    content: str
    author:  UserSchema = None
    reviewer:  UserSchema = None
    approver:  UserSchema = None
    assignnee:  UserSchema = None
    action: str
    step: str
    created_at: datetime
    updated_at: datetime


class EmemoOutPaginate(Schema):
    id: int
    title: str
    content: str
    step: str
    author:  UserSchema = None
    assignnee:  UserSchema = None
    created_at: datetime
    updated_at: datetime


class Emedia(Schema):
    file_url: str
    id: str


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
    ememo = get_object_or_404(Ememo, id=ememo_id)
    if request.auth != ememo.assignnee:
        return 401, {'message': 'You are not assigned to this'}
    flow = FlowEmemo.objects.get(source=ememo.step)
    ememo.step = flow.target
    if flow.target == "PRE_APPROVE":
        log = Log()
        log.comment = payload.comment or None
        log.description = f"change status from {flow.source} to {flow.target}"
        log.logBy = request.auth
        log.ememo = ememo
        log.save()
        ememo.assignnee = ememo.reviewer
    if flow.target == "FINAL_APPROVE":
        ememo.assignnee = ememo.approver
    if flow.target == "DONE":
        ememo.assignnee = None

    ememo.save()
    return 200, {'message': 'approve success'}


@router.put('/reject/{ememo_id}', auth=django_auth,  response={200: Message, 401: Message})
def reject(request, payload: Comment, ememo_id: int):
    ememo = get_object_or_404(Ememo, id=ememo_id)
    if request.auth != ememo.assignnee:
        return 401, {'message': 'You are not assigned to this'}
    flow = FlowEmemo.objects.get(source=ememo.step)
    if flow.can_reject == False:
        return 401, {'message': 'You cannot reject'}
    ememo.assignnee = ememo.author
    ememo.step = "Drafted"
    ememo.save()
    log = Log()
    log.comment = payload.comment or None
    log.description = "Your request is rejected"
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

    ememo_created = Ememo.objects.create(title=data.title, content=data.content,  reviewer_id=data.reviewer_id,
                                         approver_id=data.approver_id, assignnee_id=request.auth.id, author_id=request.auth.id)

    if files is not None:
        for file in files:
            EmemoMedia.objects.create(ememo=ememo_created, file_url=file)

    return {"id":  ememo_created.pk}


@router.get("/{ememo_id}", auth=django_auth, response={200: EmemoOut, 401: Message, 404: Message})
def getEmemo(request, ememo_id: int):
    try:
        ememo = Ememo.objects.select_related(
            'author', 'reviewer', 'approver', 'assignnee').get(id=ememo_id)
    except Ememo.DoesNotExist as e:
        return 404, {'message': 'Could not find ememo'}
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
    media = EmemoMedia.objects.filter(ememo__pk=ememo_id)
    print(media)
    return 200, media


@router.put("/update/{ememo_id}")
def update_ememo(request, ememo_id: int,  form: EmemoSchema = Form(...), files: List[UploadedFile] = None):
    ememo_update = get_object_or_404(Ememo, id=ememo_id)
    ememo_update.title = form.title
    ememo_update.content = form.content
    ememo_update.reviewer_id = form.reviewer
    ememo_update.approver_id = form.approver

    if files is not None:
        for file in files:
            EmemoMedia.objects.create(ememo=ememo_update, file_url=file)

    ememo_update.save()
    return {"id": ememo_update.id}


@router.post("/media/new/{ememo_id}", auth=django_auth)
def create_media(request, ememo_id: int, file: UploadedFile):
    EmemoMedia.objects.create(ememo_id=ememo_id, file_url=file)

    return {"success upload": True}


@router.get("/pagination/allememo", auth=django_auth, response=PaginatedEmemo)
def allmemo(request, perpage: int = 2, term='', page: int = 1):
    manager = request.user.groups.filter(name="Manager").exists()
    if manager:
        ememos = Ememo.objects.filter(Q(content__icontains="try once more") | Q(
            title__icontains=term)).order_by('-created_at')
    else:
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
