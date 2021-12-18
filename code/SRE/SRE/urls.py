"""SRE URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from register import views as user_view
from dashboard import views as dash_view
from dashboard import tasks as dash_tasks
urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/',user_view.register),
    path('login/',user_view.login),
    path('getusername/',user_view.getusername),
    # path('spider/',dash_view.spider),
    path('checkurl/',dash_view.checkurl),
    path('modifypassword',user_view.modifyPassword),
    path('find_pwd/', user_view.findPassword),
    path('verify_code/', user_view.Verifycode),
    path('get_data/',dash_view.get_data),
    path('test/',dash_tasks.test),
    path('checkstate/',dash_view.checkstate),
    path('wdnmd/',dash_tasks.threespider),
    path('addfavor/',user_view.addFavor),
    path('checkfavor/',user_view.checkFavor),
    path('returnfavor/',user_view.returnFavor),
    path('deletefavor/',user_view.deleteFavor)
]
