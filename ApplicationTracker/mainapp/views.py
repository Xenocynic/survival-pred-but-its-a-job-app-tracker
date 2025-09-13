from django.shortcuts import render
from rest_framework import viewsets
from .models import Application
from .serializers import ApplicationSerializer

# API
class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer

