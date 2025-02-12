from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from django.contrib.auth.models import User

from shifts.models import Doctor, SameGroupRule, Section


class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = '__all__'


class SameGroupRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SameGroupRule
        fields = '__all__'
