"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from . import views

app_name = 'lambda_rad'
urlpatterns = [
    # /lambda/
    #url(r'^$', views.index, name='index'),

    url(r'^getInstPatsAll/$', views.getInstPatsAll, name='getInstPatsAll'),
    url(r'^getPatientList/$', views.getPatientList, name='getPatientList'),
    url(r'^getPatientDetail/$', views.getPatientDetail, name='getPatientDetail'),
    url(r'^getPatientRadiomics/$', views.getPatientRadiomics, name='getPatientRadiomics'),

    url(r'^searchPatientList/$', views.searchPatientList, name='searchPatientList'),

    # /lambda/dirlist
    url(r'^dirlist/$', views.dirlist, name='dirlist'),

    #url(r'^dirlist/(.+/)?$', views.dirlist, name='dirlist'),

    # /lambda/radiomics
    # url(r'^radiomics/$', views.radiomics, name='radiomics'),

    # url(r'^data/$', views.data, name='data'),

]
