from ninja import Router
from django.conf import settings
from ninja.security import django_auth
from django.contrib.auth import get_user_model, update_session_auth_hash
from django.contrib.auth.tokens import default_token_generator
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.http import HttpResponse
from api.models import CustomUser
from django.db.models.query_utils import Q
from django import template
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import EmailMultiAlternatives


from django.contrib.auth.forms import (
    PasswordResetForm,
    SetPasswordForm,
    PasswordChangeForm
)

from django.contrib.auth import (
    login as django_login,
    logout as django_logout,
    authenticate
)

from .schema import (
    UserOut,
    LoginIn,
    RequestPasswordResetIn,
    SetPasswordIn,
    ChangePasswordIn,
    ErrorsOut
)

router = Router()
_TGS = ['Authentication']
_LOGIN_BACKEND = 'django.contrib.auth.backends.ModelBackend'


@router.post(
    '/',
    tags=_TGS,
    response={200: UserOut, 403: None},
    auth=None
)



def login(request, data: LoginIn):
    user = authenticate(backend=_LOGIN_BACKEND, **data.dict())
    if user is not None and user.is_active:
        django_login(request, user, backend=_LOGIN_BACKEND)
        return user
    return 403, None

@router.post("/csrf", tags=_TGS)
@ensure_csrf_cookie
@csrf_exempt
def get_csrf_token(request):
    return HttpResponse()


@router.delete('/logout', tags=_TGS, response={204: None}, auth=django_auth)
def logout(request):
    django_logout(request)
    return 204, None


@router.get('/me', tags=_TGS, response=UserOut, auth=django_auth)
def me(request):
    return request.user


@router.post(
    '/request_password_reset',
    tags=_TGS,
    response={204: None},
    auth=None
)
def request_password_reset(request, data: RequestPasswordResetIn):
    password_reset_form = PasswordResetForm(data.dict())
    if password_reset_form.is_valid():
       data = password_reset_form.cleaned_data['email']
       associated_users = CustomUser.objects.filter(Q(email=data))

       if associated_users.exists():
           for user in associated_users:
               subject = "Password Reset Requested"
               plaintext = template.loader.get_template('registration/password_reset_email.txt')
               htmltemp = template.loader.get_template('registration/email.html')
               c = {
					"email":user.email,
					'domain':settings.FRONTEND_URL,
					'site_name': settings.FRONTEND_URL,
					"uid": urlsafe_base64_encode(force_bytes(user.pk)),
					"user": user,
					'token': default_token_generator.make_token(user),
					'protocol': 'http',
					}
               text_content = plaintext.render(c)
               html_content = htmltemp.render(c)
               msg = EmailMultiAlternatives(subject, text_content, f'Ememo <{settings.DEFAULT_FROM_EMAIL}>', [user.email],
            #    you must add hearders 'Reply-To': settings.DEFAULT_FROM_EMAIL} to make it work
               headers = {'Reply-To': settings.DEFAULT_FROM_EMAIL})
               msg.attach_alternative(html_content, "text/html")
               msg.send()

       return 204, None

@router.post(
    '/reset_password',
    tags=_TGS,
    response={200: UserOut, 403: ErrorsOut, 422: None},
    auth=None
)
def reset_password(request, data: SetPasswordIn):
    user_field = get_user_model().USERNAME_FIELD
    user_data = {user_field: getattr(data, user_field)}
    user = get_user_model().objects.filter(**user_data)

    if user.exists():
        user = user.get()
        if default_token_generator.check_token(user, data.token):
            form = SetPasswordForm(user, data.dict())
            if form.is_valid():
                form.save()
                django_login(request, user, backend=_LOGIN_BACKEND)
                return user
            return 403, {'errors': dict(form.errors)}
    return 422, None


@router.post(
    '/change_password',
    tags=_TGS,
    response={200: None, 403: ErrorsOut},
    auth=django_auth
)
def change_password(request, data: ChangePasswordIn):
    form = PasswordChangeForm(request.user, data.dict())
    if form.is_valid():
        form.save()
        update_session_auth_hash(request, request.user)
        return 200
    return 403, {'errors': dict(form.errors)}
