from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
# Create your views here.
import json
import uuid
from . import models
from .tryvisit import tryvisit
from .get_commit import getcommit
from .get_issue import get_open_issue,get_closed_issue
from .get_pullrequest import get_open_pullrequest,get_closed_pullrequest
from dashboard import tasks

# def Read_url(request):
def checkurl(request):
    data = json.loads(request.body)
    address = str(data['RepositoryURL'])
    if address[-1] == '/':
            pass
    else:
            address = address + '/'
    print(address)
    list1 = list(models.Project.objects.values().filter(RepositoryURL=address))
    if list1:
        # 这个链接仓库里有
        # print(list1[0]['RepositoryURL']==address)
        # spideissue(address)
        return HttpResponse("true")
    else:
        # 这个链接仓库里没有
        if tryvisit(address)==404 or address.count('/') != 5:
            # print(tryvisit(address))
            return HttpResponse("仓库不存在或未开源")
        else:
            name = address[18:-1]
            project = models.Project(PID=uuid.uuid4(),Name=name,RepositoryURL=address)
            project.save()
            importDB(address)
            return HttpResponse("添加进数据库")

# def analyze_commit(url:str):
#     commitbag = getcommit(url)
#     print(commitbag)
def spideissue(url:str):
    infolist = get_open_issue(url)
    print(infolist)
    infolist = get_closed_issue(url)
    print(infolist)
    
    

#celery tasks
def importDB(url:str):
    tasks.spider.delay(url)
