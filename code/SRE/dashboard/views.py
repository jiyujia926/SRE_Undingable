from django.http.response import ResponseHeaders
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
# Create your views here.
import json
import uuid
from . import models
from register.models import User as rUser
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
        # tasks.initialcommitdata.delay(address)
        # dotest(address)
        # importDB(address)
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
            importDB(address)
            # spider(address)
            return HttpResponse("添加进数据库")

# def analyze_commit(url:str):
#     commitbag = getcommit(url)
#     print(commitbag)
def spideissue(url:str):
    infolist = get_open_issue(url)
    print(infolist)
    infolist = get_closed_issue(url)
    print(infolist)


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
    if not projectlist:
        return HttpResponse("no")
    projectname = projectlist[0]['Name'][1:]
    chartname = projectname + "-" + data['Datatype'] + "-" + data['Charttype']
    print(chartname)
    list1 = list(models.Chart.objects.filter(project=project))
    print(list1)
    if not list1:
        chart = models.Chart.objects.create(Name=chartname,ChartType=data['Charttype'],DataType=data['Datatype'],DataDetailType=data['Datatype'],TimeScale="day")
        chart.project.add(project)
        chart.HasProject.add(project)
    commitlist = list(models.DayCommit.objects.values().filter(Project=project).order_by('Time'))
    print(commitlist)
    timelist=[]
    commitcountlist=[]
    for allcommit in commitlist:
        timelist.append(str(allcommit['Time']))
        commitcountlist.append(allcommit['committedCount'])
    print(timelist)
    print(commitcountlist)
    databag = {'categoryData':timelist,'valueData':commitcountlist}
    return HttpResponse(json.dumps(databag))
    
    
    
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
       
def checkstate(request):
    data = json.loads(request.body)
    address = data['Address']
    if address[-1] == '/':
        pass
    else:
        address = address + '/'
    # address = "https://github.com/jiyujia926/NFTauction/"
    projlist = list(models.Project.objects.values().filter(RepositoryURL=address))
    if projlist[0]['State']:
        return HttpResponse("爬好了")
    else:
        return HttpResponse("还在爬")
    

def customize(request):
    data = json.loads(request.body)
    # print(data)
    template = models.Template.objects.create(Name=data['Name'],Info=data['Description'])
    template.save()
    user = rUser.objects.filter(Email=data['Email']).first()
    template.User.add(user)
    for chartitem in data['Dashboard']:
        chart = models.Chart.objects.create(ChartType=chartitem['ChartType'],
                                            DataType=chartitem['DataType'],
                                            Position=chartitem['Position'],
                                            TimeScale=chartitem['TimeScale'],
                                            CheckBox=chartitem['CheckBox'],
                                            Visible=chartitem['Visible'])
        chart.save()
        template.Chart.add(chart)
    return HttpResponse("定制成功")

def fetchcustomize(request):
    data = json.loads(request.body)
    user = rUser.objects.filter(Email=data['Email']).first()
    res=[]
    templatelist = models.Template.objects.values().filter(User=user)
    # print(templatelist)
    for template in templatelist:
        templatedict={'Name':template['Name'],'Id':template['id'],'Time':str(template['CreatedTime']),'Description':template['Info']}
        chartall=[]
        templateob = models.Template.objects.get(id=template['id'])
        chartlist = list(templateob.Chart.values().all())
        for chart in chartlist:
            # print(chart)
            chartall.append({'Position':chart['Position'],'DataType':chart['DataType'],'ChartType':chart['ChartType'],
                             'TimeScale':chart['TimeScale'],'CheckBox':chart['CheckBox'],'Visible':chart['Visible']})
        templatedict['Dashboard']=chartall
        res.append(templatedict)    
    print(res)    
    return HttpResponse(json.dumps(res))
    
def deltecustomize(request):
    data = json.loads(request.body)
    user = rUser.objects.filter(Email=data['Email']).first()
    template = models.Template.objects.values().filter(User=user, id=data['Id']).first()
    chartlist = models.Template.objects.values('Chart').filter(User=user, id=data['Id']).all()
    if template:
        template.delete()
        for item in chartlist:
            chart = models.Chart.objects.filter(id=item['Chart']).first()
            chart.delete()
        return HttpResponse("删除成功")
    else:
        return HttpResponse("删除失败")


#celery tasks
def importDB(url:str):
    tasks.spider.delay(url)
def dotest(url:str):
    tasks.spider.delay(url)
