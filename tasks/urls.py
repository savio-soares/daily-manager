from django.urls import path
from rest_framework import routers
from .views import TaskViewSet, FinanceViewSet

router = routers.DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'finances', FinanceViewSet, basename='finance')

urlpatterns = router.urls
# Este arquivo define as rotas da API do app tasks.
