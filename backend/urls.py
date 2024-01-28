from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from .api import api
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views
from django.contrib import admin

from django_ses.views import SESEventWebhookView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('admin/django-ses/', include('django_ses.urls')),
    # path('test/', include('api.urls')),
    path('hijack/', include('hijack.urls')),
    path("api/v1/", api.urls),
    # path('password_reset/<uidb64>/<token>/', TemplateView.as_view(template_name="base.html"),
    #     name='password_reset_confirm')
    path('password_reset/<email>/<token>/', TemplateView.as_view(template_name="base.html"),
    name='password_reset_confirm'),
    path('ses/event-webhook/', SESEventWebhookView.as_view(), name='handle-event-webhook'),
]


if settings.DEBUG:
    urlpatterns+=static(settings.STATIC_URL , document_root=settings.STATIC_ROOT)
    urlpatterns+= static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns+= [ re_path(r'^.*$', TemplateView.as_view(template_name="base.html"))]

