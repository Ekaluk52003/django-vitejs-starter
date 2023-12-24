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

class EmemoSchema(ModelSchema):
    class Config:
        model = Ememo
        model_fields = "__all__"
        # model_exclude = ['assignnee','file','author', 'id', 'created_at', 'updated_at']
        model_exclude = ['assignnee','author', 'id', 'created_at', 'updated_at']



class Message(Schema):
    message: str

class EmemoOut(ModelSchema):
     class Config:
        model = Ememo
        model_fields = "__all__"


class Emedia(Schema):
    file_url:str
    id:str



from django.shortcuts import get_object_or_404

router = Router()
_TGS = ['Ememo']

class Comment(Schema):
    comment: str = None


class emomoUpdate(Schema):
    title: str = None
    content: str = None
    reviewer_id :  str = None
    approver_id :  str = None



@router.put('/approve/{ememo_id}', auth=django_auth )
def approve(request, payload:Comment, ememo_id:int):
    ememo = get_object_or_404(Ememo, id=ememo_id)
    if request.auth != ememo.assignnee :
         return 401, {'message': 'You are not assigned to this'}
    flow = FlowEmemo.objects.get(source=ememo.step)
    ememo.step = flow.target
    if flow.target == "PRE_APPROVE" :
        log = Log()
        log.comment = payload.comment or None
        log.description = f"change status from {flow.source} to {flow.target}"
        log.logBy = request.auth
        log.ememo = ememo
        log.save()
        ememo.assignnee = ememo.reviewer
    if flow.target == "FINAL_APPROVE" :
         ememo.assignnee = ememo.approver
    if flow.target == "DONE" :
         ememo.assignnee = None

    ememo.save()
    return 200, {'message': 'approve success'}

@router.put('/reject/{ememo_id}', auth=django_auth,  response={200:Message, 401: Message}  )
def reject(request, payload:Comment, ememo_id:int):
    ememo = get_object_or_404(Ememo, id=ememo_id)
    if request.auth != ememo.assignnee :
        return 401, {'message': 'You are not assigned to this'}
    flow = FlowEmemo.objects.get(source=ememo.step)
    if flow.can_reject == False :
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

@router.put('/revert/{ememo_id}', auth=django_auth,  response={200:Message, 401: Message}  )
def revert(request, payload:Comment, ememo_id:int):
    ememo = get_object_or_404(Ememo, id=ememo_id)
    if request.auth != ememo.assignnee :
        return 401, {'message': 'You are not assigned to this'}
    flow = FlowEmemo.objects.get(source=ememo.step)
    if flow.can_revert == False :
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
@router.put('/save/{ememo_id}',  auth=django_auth, response={200:Message, 401: Message} )
def save(request, payload: emomoUpdate, ememo_id:int):
    # check asignnee to be done

    ememo = get_object_or_404(Ememo, id=ememo_id)

    if request.auth != ememo.assignnee :
           return 401, {'message': 'Unauthorized'}
    if ememo.step != "Drafted" :
           return 401, {'message': 'Unauthorized'}
    reviewer = CustomUser.objects.get(pk=payload.reviewer_id)
    approver = CustomUser.objects.get(pk=payload.approver_id)
    ememo.title = payload.title
    ememo.content = payload.content
    ememo.reviewer = reviewer
    ememo.approver = approver
    ememo.save()
    return 200, {'message': 'updated success'}


@router.post("/create", auth=django_auth)

def create_ememo(request, data:EmemoSchema= Form(...), files: List[UploadedFile] = None):

    ememo_created = Ememo.objects.create(title=data.title, content=data.content, author=request.auth,
                                 assignnee=request.auth, reviewer_id=data.reviewer, approver_id=data.approver )

    if files is not None :
        for file in files:
            EmemoMedia.objects.create(ememo=ememo_created, file_url=file)

    return {"id":  ememo_created.pk }


@router.get("/{ememo_id}", auth=django_auth, response={200:EmemoOut, 401: Message} )
def getEmemo(request, ememo_id: int):
    ememo = get_object_or_404(Ememo, id=ememo_id)
    if request.auth != ememo.assignnee and request.auth != ememo.author and request.auth != ememo.reviewer and request.auth != ememo.approver    :
        return 401, {'message': 'Unauthorized'}
    return 200, ememo

@router.delete("/media/delete/{media_id}", auth=django_auth , response={200: Message, 404: Message})
def delete_media(request, media_id: int):
    try:
        track = EmemoMedia.objects.get(pk=media_id)
        track.delete()
        return 200, {"message": "delete success"}
    except EmemoMedia.DoesNotExist as e:
        return 404, {"message": "Could not find media"}

@router.get("/media/{ememo_id}", auth=django_auth, response=List[Emedia] )
def ememo_media(request, ememo_id: int):
    media = EmemoMedia.objects.filter(ememo__pk=ememo_id)
    print(media)
    return 200, media

@router.post("/media/new/{ememo_id}", auth=django_auth )
def create_media(request, ememo_id:int, file: UploadedFile):
    EmemoMedia.objects.create(ememo_id=ememo_id, file_url=file)

    return {"success upload":True}

