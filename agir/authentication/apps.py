from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    name = "agir.authentication"

    def ready(self):
        from . import signals
