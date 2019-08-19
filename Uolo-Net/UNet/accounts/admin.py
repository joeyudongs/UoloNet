# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from .models import UserProfile
#import UserProfile

admin.site.register(UserProfile)


# Register your models here.
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'description')

    def user_info(self, obj):
        return obj.description

