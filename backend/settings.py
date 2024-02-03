from pathlib import Path
import os
import dj_database_url
from dotenv import load_dotenv


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')
SECRET_KEY = os.getenv('SECRET_KEY')
DEBUG = os.getenv('DEBUG', '0').lower() in ['true', 't', '1']
# CSRF_TRUSTED_ORIGINS = os.getenv('CSRF_TRUSTED_ORIGINS').split(' ')
CSRF_TRUSTED_ORIGINS = os.getenv('CSRF_TRUSTED_ORIGINS')
ALLOWED_HOSTS  = os.getenv('ALLOWED_HOSTS').split(' ')
# ALLOWED_HOSTS  = os.getenv('ALLOWED_HOSTS')

# Application definition

INSTALLED_APPS = [
    'admin_interface',
    'colorfield',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'api',
    'note',
    'ememo',
    'django_fsm_log',
    'storages',
    'hijack',
    'hijack.contrib.admin',
    'django_ses',
    'django_cron',
    'django_crontab'


]
X_FRAME_OPTIONS = "SAMEORIGIN"              # allows you to use modals insated of popups
SILENCED_SYSTEM_CHECKS = ["security.W019"]  # ignores redundant warning messages

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
     'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'ninja_put_patch_file_upload_middleware.middlewares.process_put_patch',
    'hijack.middleware.HijackUserMiddleware'
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR/"html"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }



# DATABASES = {
#     'default': dj_database_url.parse(os.environ.get('DATABASE_URL'))
# }

DATABASES = {
    'default': dj_database_url.parse(os.getenv('DATABASE_URL'))
}

# DATABASES = {
#     "default": {
#         "ENGINE": "django.db.backends.postgresql",
#         "NAME": "tutorial",
#         "USER": "tutorial",
#         "PASSWORD": "tutorial",
#         "HOST": "db",  # set in docker-compose.yml
#         "PORT": 5433,  # default postgres port
#     }
# }


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Bangkok'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = '/static/'

# when run collectstatic Django will look for these folders
STATICFILES_DIRS = [
    BASE_DIR / "dist",
    BASE_DIR / "public",
]
# where Djang go server satic file
STATIC_ROOT = BASE_DIR / "static"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


INTERNAL_IPS = [
    'localhost',
    '127.0.0.1',
]

CSRF_COOKIE_SAMESITE = 'Strict'
SESSION_COOKIE_SAMESITE = 'Strict'
CSRF_COOKIE_HTTPONLY = False  # False since we will grab it via universal-cookies
SESSION_COOKIE_HTTPONLY = True


AUTH_USER_MODEL = "api.CustomUser"

FILE_UPLOAD_STORAGE = os.getenv("FILE_UPLOAD_STORAGE", default="local")


if  FILE_UPLOAD_STORAGE == "local":
    MEDIA_URL = '/media/'
    MEDIA_ROOT = BASE_DIR / 'uploads/'


if FILE_UPLOAD_STORAGE == "s3":

    MEDIA_URL = '/media/'
    MEDIA_ROOT = BASE_DIR / 'uploads/'
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION = 'ap-southeast-1'
    AWS_DEFAULT_ACL = 'private'
    #The number of seconds that a generated URL is valid for
    # https://django-storages.readthedocs.io/en/latest/backends/amazon-S3.html#configuration-settings
    AWS_QUERYSTRING_EXPIRE = 5000 # seconds



DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL')
USE_SES_V2 = True

# EMAIL_BACKEND = os.getenv("EMAIL_BACKEND", default="local")
# if  EMAIL_BACKEND == "ses":
EMAIL_BACKEND = 'django_ses.SESBackend'
AWS_SES_REGION_NAME =  os.getenv('AWS_SES_REGION_NAME')
AWS_SES_REGION_ENDPOINT =  os.getenv('AWS_SES_REGION_ENDPOINT')
AWS_SES_ACCESS_KEY_ID = os.getenv('AWS_SES_ACCESS_KEY_ID')
AWS_SES_SECRET_ACCESS_KEY = os.getenv('AWS_SES_SECRET_ACCESS_KEY')

# if  EMAIL_BACKEND == "local":
#     EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"


FRONTEND_URL=os.getenv("FRONTEND_URL", default="http://127.0.0.1:8000")


HIJACK_PERMISSION_CHECK = "hijack.permissions.superusers_and_staff"
# Redirect User after Hjack
LOGIN_REDIRECT_URL=f"{FRONTEND_URL}/dashboard/profile"


# AWS Configuration sets name --> event-destinations
AWS_SES_CONFIGURATION_SET="Emailnotice"


# CRON_CLASSES = [
#     "backend.cron_jobs.MyCronJob",
# ]

CRONJOBS = [
    ('5 * * * *', 'backend.cron.cron_test'),
]