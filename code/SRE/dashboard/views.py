from django.http.response import ResponseHeaders
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
        initialcommitdata(address)
        return HttpResponse("true")
    else:
        # 这个链接仓库里没有
        if tryvisit(address)==404 or address.count('/') != 5:
            # print(tryvisit(address))
            return HttpResponse("仓库不存在或未开源")
        else:
            name = address[18:-1]
            project = models.Project(PID=uuid.uuid4(),Name=name,RepositoryURL=address,State=False)
            project.save()
            # importDB(address)
            spider(address)
            return HttpResponse("添加进数据库")

# def analyze_commit(url:str):
#     commitbag = getcommit(url)
#     print(commitbag)
def spideissue(url:str):
    infolist = get_open_issue(url)
    print(infolist)
    infolist = get_closed_issue(url)
    print(infolist)
    
def initialcommitdata(url:str):
    project = models.Project.objects.filter(RepositoryURL=url).first()
    list1 = list(models.CommitRecord.objects.values().filter(Project=project).order_by('Time'))
    # print(list1)
    timelist = []
    valuelist = []
    commitlist = []
    timecommitdict = {}
    for commitrecord in list1:
        thistime = commitrecord['Time']
        # print(thistime)
        if thistime in timecommitdict.keys():
            timecommitdict[thistime] = timecommitdict[thistime] + 1
        else:
            timecommitdict[thistime] = 1
    # print(timecommitdict)
    timelist = list(timecommitdict.keys())
    valuelist = list(timecommitdict.values())
    # print(timelist)
    # print(valuelist)
    for i in range(0,len(timelist)):
        allcommit = models.AllCommit.objects.create(Time=timelist[i],Count=valuelist[i])
        allcommit.Project.add(project)
    # commitlist = list(models.AllCommit.objects.values().filter(Project=project).order_by('Time'))
    # print(commitlist)

def get_data(request):
    data = json.loads(request.body)
    print(data)
    address = data['Address']
    if address[-1] == '/':
            pass
    else:
            address = address + '/'
    project = models.Project.objects.filter(RepositoryURL=address).first()
    projectlist = list(models.Project.objects.values().filter(RepositoryURL=address))
    projectname = projectlist[0]['Name'][1:]
    chartname = projectname + "-" + data['Datatype'] + "-" + data['Charttype']
    print(chartname)
    chart = models.Chart.objects.create(Name=chartname,ChartType=data['Charttype'],DataType=data['Datatype'])
    chart.project.add(project)
    chart.HasProject.add(project)
    commitlist = list(models.AllCommit.objects.values().filter(Project=project).order_by('Time'))
    print(commitlist)
    timelist=[]
    countlist=[]
    for allcommit in commitlist:
        timelist.append(str(allcommit['Time']))
        countlist.append(str(allcommit['Count']))
    print(timelist)
    print(countlist)
    
    
    
def spider(url:str):
    analyze_commit(url)

def analyze_commit(url:str):
    commitbag = getcommit(url)
    project = models.Project.objects.filter(RepositoryURL=url).first()
    if commitbag:
        for item in commitbag:
            GithubList = list(models.Contributor.objects.values().filter(Github=item['commitor']))
            if GithubList:
                contributor = models.Contributor.objects.filter(Github=item['commitor']).first()
                if project not in contributor.Project.all():
                    contributor.Project.add(project)
            else:
                contributor = models.Contributor.objects.create(Github=item['commitor'])
                contributor.Project.add(project)
            commitRecord = models.CommitRecord.objects.create(Time=item['commit_time'],ChangedFileCount=item['changed_file'],AdditionCount=item['additions'],DeletionCount=item['deletions'])
            commitRecord.Project.add(project)
            commitRecord.Contributor.add(contributor)
       
    

#celery tasks
def importDB(url:str):
    tasks.spider.delay(url)
