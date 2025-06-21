from django.shortcuts import render # Função para renderizar templates HTML
from rest_framework import generics, viewsets # Views genéricas para API REST
from .models import Task, Finance # Importa os modelos Task e Finance
from .serializers import TaskSerializer, FinanceSerializer # Importa os serializers
from django.utils import timezone # Para manipular datas
from rest_framework.response import Response # Para respostas customizadas
from rest_framework.decorators import api_view, action # Para views baseadas em função
from rest_framework.views import APIView
from django.db.models import Sum
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

# Aqui ficarão as funções (views) que recebem requisições HTTP e retornam respostas.
# Exemplo: listar tarefas, criar tarefa, etc.
# Cada view pode ser uma função ou uma classe.

# View para listar e criar tarefas
class TaskListCreateView(generics.ListCreateAPIView): # Herda comportamento padrão de listar/criar
    queryset = Task.objects.all() # Busca todas as tarefas
    serializer_class = TaskSerializer # Usa o serializer para conversão

    def get_queryset(self):
        # Permite filtrar por tag, data, etc, via parâmetros na URL
        queryset = super().get_queryset()
        tag = self.request.query_params.get('tag')
        if tag:
            queryset = queryset.filter(tags__icontains=tag)
        # Filtros por data (diário, semanal, mensal)
        view = self.request.query_params.get('view')
        date = self.request.query_params.get('date')
        if view and date:
            try:
                ref_date = timezone.datetime.fromisoformat(date)
            except Exception:
                ref_date = timezone.now()
            if view == 'day':
                queryset = queryset.filter(created_at__date=ref_date.date())
            elif view == 'week':
                start = ref_date - timezone.timedelta(days=ref_date.weekday())
                end = start + timezone.timedelta(days=6)
                queryset = queryset.filter(created_at__date__range=[start.date(), end.date()])
            elif view == 'month':
                queryset = queryset.filter(created_at__year=ref_date.year, created_at__month=ref_date.month)
        return queryset.order_by('-created_at')

    def list(self, request, *args, **kwargs):
        # Suporte ao progresso diário
        print('DEBUG: Entrou no método list do TaskViewSet')
        if request.query_params.get('progress_by_day') == '1':
            start = request.query_params.get('start')
            end = request.query_params.get('end')
            qs = self.get_queryset()
            from django.utils import timezone
            if start and end:
                qs = qs.filter(created_at__date__range=[start, end])
            # DEBUG: loga as datas locais de criação das tarefas filtradas
            print('DEBUG tarefas filtradas:', [timezone.localtime(t.created_at) for t in qs])
            # Agrupa por dia de criação (timezone local)
            from collections import defaultdict
            total = defaultdict(int)
            done = defaultdict(int)
            for t in qs:
                key = timezone.localtime(t.created_at).strftime('%Y-%m-%d')
                total[key] += 1
                if t.is_completed:
                    done[key] += 1
            result = {}
            for k in total:
                result[k] = done[k] / total[k] if total[k] else 0
            return Response(result)
        return super().list(request, *args, **kwargs)

# View para detalhes, atualização e exclusão de tarefas individuais
class TaskDetailView(generics.RetrieveUpdateAPIView): # Herda comportamento padrão de detalhar/atualizar
    queryset = Task.objects.all() # Busca todas as tarefas
    serializer_class = TaskSerializer # Usa o serializer para conversão

# View para listar, criar, atualizar e excluir entradas financeiras
class FinanceViewSet(viewsets.ModelViewSet):
    queryset = Finance.objects.all().order_by('-created_at')
    serializer_class = FinanceSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        tag = self.request.query_params.get('tag')
        date = self.request.query_params.get('date')
        if tag:
            queryset = queryset.filter(tags__icontains=tag)
        if date:
            queryset = queryset.filter(created_at__date=date)
        return queryset

    @action(detail=False, methods=['get'])
    def by_day(self, request):
        # Retorna soma dos valores por dia
        start = request.query_params.get('start')
        end = request.query_params.get('end')
        qs = self.get_queryset()
        if start:
            qs = qs.filter(created_at__date__gte=start)
        if end:
            qs = qs.filter(created_at__date__lte=end)
        data = (
            qs.values('created_at__date')
            .annotate(total=Sum('value'))
            .order_by('created_at__date')
        )
        return Response(data)

# ViewSet para tarefas, permitindo listagem, criação, atualização e exclusão
class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        tag = self.request.query_params.get('tag')
        if tag:
            queryset = queryset.filter(tags__icontains=tag)
        view = self.request.query_params.get('view')
        date = self.request.query_params.get('date')
        if view and date:
            try:
                ref_date = timezone.datetime.fromisoformat(date)
            except Exception:
                ref_date = timezone.now()
            if view == 'day':
                queryset = queryset.filter(created_at__date=ref_date.date())
            elif view == 'week':
                start = ref_date - timezone.timedelta(days=ref_date.weekday())
                end = start + timezone.timedelta(days=6)
                queryset = queryset.filter(created_at__date__range=[start.date(), end.date()])
            elif view == 'month':
                queryset = queryset.filter(created_at__year=ref_date.year, created_at__month=ref_date.month)
        return queryset

    def list(self, request, *args, **kwargs):
        # Log amigável para produção
        print(f'[TaskViewSet] list chamada por: {request.user} | params: {request.query_params}')
        try:
            # Suporte ao progresso diário
            if request.query_params.get('progress_by_day') == '1':
                start = request.query_params.get('start')
                end = request.query_params.get('end')
                qs = self.get_queryset()
                from django.utils import timezone
                if start and end:
                    qs = qs.filter(created_at__date__range=[start, end])
                # Agrupa por dia de criação (timezone local)
                from collections import defaultdict
                total = defaultdict(int)
                done = defaultdict(int)
                for t in qs:
                    key = timezone.localtime(t.created_at).strftime('%Y-%m-%d')
                    total[key] += 1
                    if t.is_completed:
                        done[key] += 1
                result = {}
                for k in total:
                    result[k] = done[k] / total[k] if total[k] else 0
                # Garante retorno 200 com objeto vazio se não houver dados
                return Response(result, status=200)
            # Caso padrão: lista tarefas normalmente
            return super().list(request, *args, **kwargs)
        except Exception as e:
            # Loga erro para debug online
            print(f'[TaskViewSet] ERRO: {e}')
            return Response({'detail': 'Erro ao processar requisição.'}, status=500)

# Permitir acesso público ao endpoint de login
class PublicTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
