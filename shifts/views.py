from django.shortcuts import render
from rest_framework import viewsets
from django.contrib.auth.models import User

from shifts.models import Doctor, Section, SameGroupRule
from shifts.serializer import DoctorSerializer, SectionSerializer, SameGroupRuleSerializer


# Create your views here.

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer


class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer


class SameGroupRuleViewSet(viewsets.ModelViewSet):
    queryset = SameGroupRule.objects.all()
    serializer_class = SameGroupRuleSerializer
