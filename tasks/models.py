from django.db import models

# Modelo Task representa uma tarefa diária do usuário.
# Cada campo do modelo é uma coluna na tabela do banco de dados.
# Os modelos do Django facilitam a criação, leitura, atualização e exclusão de dados.
class Task(models.Model):
    title = models.CharField(max_length=200, help_text="Título curto e objetivo da tarefa.") # Título da tarefa
    description = models.TextField(blank=True, help_text="Descrição detalhada da tarefa.") # Descrição (opcional)
    created_at = models.DateTimeField(auto_now_add=True, help_text="Data/hora em que a tarefa foi criada.") # Data de criação
    completed_at = models.DateTimeField(null=True, blank=True, help_text="Data/hora em que a tarefa foi concluída.") # Data de conclusão (opcional)
    is_completed = models.BooleanField(default=False, help_text="Indica se a tarefa foi concluída.") # Status de conclusão
    tags = models.CharField(max_length=200, blank=True, help_text="Tags separadas por vírgula para categorizar tarefas.") # Tags simples

    def __str__(self):
        return self.title # Exibe o título ao mostrar o objeto

    def mark_completed(self):
        """Marca a tarefa como concluída e define a data de conclusão."""
        from django.utils import timezone
        self.is_completed = True # Marca como concluída
        self.completed_at = timezone.now() # Define data de conclusão
        self.save() # Salva no banco

class Finance(models.Model):
    description = models.CharField(max_length=255)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    tags = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.description} - R${self.value} ({self.created_at.date()})"
