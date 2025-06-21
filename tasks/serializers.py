from rest_framework import serializers
from .models import Task, Finance

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__' # Serializa todos os campos do modelo Task
        # O serializer converte objetos Task em JSON e valida dados recebidos via API

class FinanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Finance
        fields = ['id', 'description', 'value', 'tags', 'created_at']
        # O serializer converte objetos Finance em JSON e valida dados recebidos via API
