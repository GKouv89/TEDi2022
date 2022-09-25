from django.apps import AppConfig


class MatrixfactorizationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'matrixFactorization'

    def ready(self):
        from . import updater
        updater.start()
