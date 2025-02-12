from django.core.validators import MinLengthValidator, MaxLengthValidator
from django.db import models
from django.contrib.auth.models import AbstractUser
from django_jalali.db import models as jalali_models


# Create your models here.


class Doctor(models.Model):
    name = models.CharField(max_length=120)


class Section(models.Model):
    name = models.CharField(max_length=120)
    capacity = models.IntegerField()


class SameGroupRule(models.Model):
    doctors = models.ManyToManyField(Doctor)
    section = models.ForeignKey(Section, on_delete=models.CASCADE)