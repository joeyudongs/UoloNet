# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from decimal import Decimal

# Create your models here.
class Institution(models.Model):
    name = models.CharField(max_length=500)
    data_folder = models.CharField(max_length=1024, default='')


class Patient(models.Model):
    patient_id = models.CharField(max_length=30)
    name = models.CharField(max_length=100, default='', blank=True)
    name_first = models.CharField(max_length=50, default='', blank=True)
    name_middle = models.CharField(max_length=50, default='', blank=True)
    name_last = models.CharField(max_length=50, default='', blank=True)
    gender = models.CharField(max_length=30, blank=True)
    race = models.CharField(max_length=30, blank=True)
    age = models.IntegerField(default=0, blank=True)
    birth_date = models.CharField(max_length=30, null=True)
    data_folder = models.CharField(max_length=1024, default='')
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.id) + " " + str(self.patient_id) + " " + self.name + " " + self.gender


class MedicalRecord(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    key = models.CharField(max_length=1024)
    value = models.CharField(max_length=1024)


class Study(models.Model):
    uid = models.CharField(primary_key=True, max_length=200)
    description = models.CharField(max_length=1024)
    date = models.CharField(max_length= 50, default='00000000')


class Series(models.Model):
    uid = models.CharField(primary_key=True, max_length=200)
    description = models.CharField(max_length=1024)
    date = models.CharField(max_length=50)
    modality = models.CharField(max_length=50)


class Dosimetry(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)

    roi = models.CharField(max_length=1024)
    type = models.CharField(max_length=30)
    dose = models.DecimalField(max_digits=10,decimal_places=2,default=Decimal('0.00'))
    volume = models.DecimalField(max_digits=10,decimal_places=2,default=Decimal('0.00'))