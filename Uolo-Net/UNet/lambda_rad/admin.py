# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from lambda_rad import models as lambda_model

# Register your models here.

class InstitutionAdmin(admin.ModelAdmin):
    list_display = ('name', 'data_folder')
admin.site.register(lambda_model.Institution, InstitutionAdmin)


admin.site.register(lambda_model.Patient)
admin.site.register(lambda_model.MedicalRecord)



