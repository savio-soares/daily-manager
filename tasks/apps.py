from django.apps import AppConfig # Importa a classe base para configuração de apps


class TasksConfig(AppConfig): # Configuração do app 'tasks'
    default_auto_field = 'django.db.models.BigAutoField' # Tipo padrão de campo auto-incremento
    name = 'tasks' # Nome do app
