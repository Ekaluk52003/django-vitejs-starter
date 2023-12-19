from django.apps import AppConfig


class EmemoConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ememo'

    def ready(self):
        import ememo.signals