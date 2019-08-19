from django.conf.urls import url
from home.views import HomeView
from home import views

app_name = 'home'
urlpatterns = [
    url(r'^home/$', HomeView.as_view(), name='home'),
    #url(r'^search/$', views.search, name='search'),
]
