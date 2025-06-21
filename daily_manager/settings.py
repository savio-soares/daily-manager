"""
Django settings for daily_manager project.

Este arquivo contém as configurações principais do projeto Django.
Abaixo, explico os blocos obrigatórios e o que cada um faz.

- SECRET_KEY: Chave secreta usada para segurança do projeto. Nunca compartilhe em produção.
- DEBUG: Ativa/desativa o modo de depuração. Nunca deixe True em produção.
- ALLOWED_HOSTS: Lista de domínios/IPs permitidos a acessar o projeto.

# Application definition

INSTALLED_APPS = [
    # Apps internos do Django, necessários para funcionalidades básicas (admin, autenticação, sessões, etc)
    'django.contrib.admin',  # Interface administrativa
    'django.contrib.auth',   # Sistema de autenticação de usuários
    'django.contrib.contenttypes', # Permite trabalhar com tipos de conteúdo genéricos
    'django.contrib.sessions', # Gerenciamento de sessões de usuário
    'django.contrib.messages', # Sistema de mensagens entre views e templates
    'django.contrib.staticfiles', # Gerenciamento de arquivos estáticos (CSS, JS, imagens)
    # Apps criados pelo usuário devem ser adicionados aqui para serem reconhecidos pelo Django
    # App de tarefas diárias
    'tasks', # App de tarefas diárias criado pelo usuário
]

# MIDDLEWARE é uma lista de componentes que processam requisições/respostas globalmente.
# Eles podem adicionar funcionalidades como segurança, autenticação, manipulação de sessões, etc.
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware', # Segurança básica
    'django.contrib.sessions.middleware.SessionMiddleware', # Gerencia sessões
    'django.middleware.common.CommonMiddleware', # Funcionalidades comuns (ex: manipulação de headers)
    'django.middleware.csrf.CsrfViewMiddleware', # Protege contra CSRF
    'django.contrib.auth.middleware.AuthenticationMiddleware', # Autenticação de usuários
    'django.contrib.messages.middleware.MessageMiddleware', # Mensagens entre views/templates
    'django.middleware.clickjacking.XFrameOptionsMiddleware', # Protege contra clickjacking
]

# ROOT_URLCONF define o arquivo principal de rotas (urls.py) do projeto
ROOT_URLCONF = 'daily_manager.urls' # Arquivo principal de rotas (urls.py)

# TEMPLATES define como o Django irá renderizar HTML (templates)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates', # Motor de templates padrão
        'DIRS': [], # Pastas adicionais para buscar templates
        'APP_DIRS': True, # Procura templates dentro dos apps
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request', # Adiciona o objeto request ao contexto
                'django.contrib.auth.context_processors.auth', # Adiciona informações de autenticação
                'django.contrib.messages.context_processors.messages', # Adiciona mensagens
            ],
        },
    },
]

# WSGI_APPLICATION aponta para o arquivo WSGI, usado para deploy
WSGI_APPLICATION = 'daily_manager.wsgi.application' # Arquivo WSGI para deploy

# DATABASES define as configurações do banco de dados
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Usando SQLite por padrão (simples para testes)
        'NAME': BASE_DIR / 'db.sqlite3', # Caminho do banco
    }
}

# AUTH_PASSWORD_VALIDATORS define validadores de senha para maior segurança
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', # Valida similaridade
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', # Valida tamanho mínimo
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', # Valida senha comum
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', # Valida se é só número
    },
]


# LANGUAGE_CODE e TIME_ZONE definem idioma e fuso horário padrão
LANGUAGE_CODE = 'en-us' # Idioma padrão

TIME_ZONE = 'America/Sao_Paulo' # Fuso horário do Brasil

USE_I18N = True # Internacionalização

USE_TZ = True   # Uso de timezones


# STATIC_URL define o caminho para arquivos estáticos (CSS, JS, imagens)
STATIC_URL = 'static/' # Caminho para arquivos estáticos


# DEFAULT_AUTO_FIELD define o tipo padrão de campo auto-incremento para modelos
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField' # Tipo padrão de campo auto-incremento

# Resumindo: os blocos obrigatórios são SECRET_KEY, DEBUG, ALLOWED_HOSTS, INSTALLED_APPS, MIDDLEWARE, ROOT_URLCONF, TEMPLATES, WSGI_APPLICATION, DATABASES, LANGUAGE_CODE, TIME_ZONE, STATIC_URL e DEFAULT_AUTO_FIELD. Outros podem ser adicionados conforme necessidade do projeto.
"""

from pathlib import Path
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-zt$4mi3%4p((lf9%kvrvpqqa$)@dn&1)civ5-xocv^)5!yx5j0'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# ALLOWED_HOSTS para produção e local
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '.onrender.com',  # Permite qualquer subdomínio do Render
]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',  # Interface administrativa
    'django.contrib.auth',   # Sistema de autenticação de usuários
    'django.contrib.contenttypes', # Tipos de conteúdo genéricos
    'django.contrib.sessions', # Gerenciamento de sessões
    'django.contrib.messages', # Sistema de mensagens
    'django.contrib.staticfiles', # Arquivos estáticos (CSS, JS, imagens)
    'rest_framework', # Django REST Framework para criar APIs
    'rest_framework_simplejwt', # JWT para autenticação
    'corsheaders', # Adiciona suporte a CORS
    'tasks', # App de tarefas diárias criado pelo usuário
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware', # Segurança básica
    'django.contrib.sessions.middleware.SessionMiddleware', # Sessões
    'django.middleware.common.CommonMiddleware', # Funcionalidades comuns
    'django.middleware.csrf.CsrfViewMiddleware', # Proteção CSRF
    'django.contrib.auth.middleware.AuthenticationMiddleware', # Autenticação
    'django.contrib.messages.middleware.MessageMiddleware', # Mensagens
    'django.middleware.clickjacking.XFrameOptionsMiddleware', # Proteção clickjacking
    'corsheaders.middleware.CorsMiddleware', # Middleware do CORS (deve ser o primeiro)
]

ROOT_URLCONF = 'daily_manager.urls' # Arquivo principal de rotas (urls.py)

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates', # Motor de templates
        'DIRS': [], # Pastas extras para templates
        'APP_DIRS': True, # Procura templates nos apps
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request', # Adiciona request ao contexto
                'django.contrib.auth.context_processors.auth', # Info de autenticação
                'django.contrib.messages.context_processors.messages', # Mensagens
            ],
        },
    },
]

WSGI_APPLICATION = 'daily_manager.wsgi.application' # Arquivo WSGI para deploy


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

import environ
import dj_database_url

# Inicializa o django-environ
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# Configuração do banco de dados para produção (PostgreSQL via DATABASE_URL)
DATABASES = {
    'default': dj_database_url.config(
        default=env('DATABASE_URL', default='sqlite:///' + str(BASE_DIR / 'db.sqlite3'))
    )
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', # Valida similaridade
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', # Valida tamanho mínimo
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', # Valida senha comum
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', # Valida se é só número
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us' # Idioma padrão

TIME_ZONE = 'America/Sao_Paulo' # Fuso horário do Brasil

USE_I18N = True # Internacionalização

USE_TZ = True   # Uso de timezones


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = '/static/' # Caminho para arquivos estáticos (corrigido para barra inicial)
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles') # Caminho para arquivos estáticos coletados


# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField' # Tipo padrão de campo auto-incremento

# Configuração do Django REST Framework para usar JWT
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# Configuração do CORS para aceitar requisições do frontend hospedado no Render e localmente
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://daily-manager-frontend.onrender.com',
    'https://daily-manager-1.onrender.com',  # Adicionado domínio do frontend publicado
]
