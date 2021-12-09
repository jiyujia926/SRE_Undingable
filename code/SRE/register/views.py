from django.shortcuts import render
from django.http import HttpResponse
import json
import uuid
from . import models
# Create your views here.
def register(request):
    data = json.loads(request.body)
    checkemail = list(models.User.objects.values('Email').filter(Email = data['Email']))
    if checkemail:
        return HttpResponse("邮箱已被注册")
    else:
        data['UID'] = uuid.uuid4()
        models.User.objects.create(**data)
        return HttpResponse("注册成功！")

def login(request):
    data = json.loads(request.body)
    logininguser = list(models.User.objects.values('Password').filter(Email=data['Email']))
    if logininguser:
        if logininguser[0]['Password'] == data['Password']:
            return HttpResponse("密码正确")
        else:
            return HttpResponse("密码错误")
    else:
        return HttpResponse("未注册")
def getusername(request):
    data = json.loads(request.body)
    loginuser = list(models.User.objects.values('Name')).filter(Email = data['Email'])
    if loginuser:
        return HttpResponse(loginuser[0]['Name'])
    else:
        return HttpResponse("没这个人")