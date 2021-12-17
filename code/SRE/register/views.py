from django.db.models.fields.related import create_many_to_many_intermediary_model
from django.shortcuts import render
from django.http import HttpResponse
from django.core.mail import send_mail
from threading import Thread     # 导入线程模块
from SRE import settings
import json
import uuid
import random
import datetime
import pytz

from . import models
from dashboard import models as dashboard_models
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
    loginuser = list(models.User.objects.values('Name').filter(Email = data['Email']))
    if loginuser:
        return HttpResponse(loginuser[0]['Name'])
    else:
        return HttpResponse("没这个人")

def modifyPassword(request):
    data = json.loads(request.body)
    user = list(models.User.objects.values('Password').filter(Email=data['Email']))
    if user:
        if user[0]['Password'] == data['Password']:
            models.User.objects.filter(Email=data['Email']).update(Password=data['Newpassword'])
            return HttpResponse("修改成功")
        else:
            return HttpResponse("密码错误")
    else:
        return HttpResponse("该邮箱未注册")

#随机生成验证码
def random_str(randomlength=6):
    random.random()
    str = ''
    chars = 'abcdefghijklmnopqrstuvwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    length = len(chars) - 1
    for i in range(randomlength):
        str += chars[random.randint(0, length)]
    return str

#发送邮件找回密码 
def findPassword(request):
    data = json.loads(request.body)
    Email = data['Email']
    user = models.User.objects.filter(Email=data['Email']).first()
    if user:
        email_title = "找回密码"
        code = random_str()             #随机生成的验证码
        IdentifyingCode = models.IdentifyingCode.objects.create(Code=code)
        IdentifyingCode.User.add(user)
        email_body = "验证码为: {0}".format(code)
        t1 = Thread( target = send_mail, args = (email_title, email_body, settings.EMAIL_HOST_USER,[Email]) ) 
        t1.start()
        return HttpResponse("验证码已发送，请查收邮件")
    else:
        return HttpResponse("邮箱未注册")


def Verifycode(request):
    data = json.loads(request.body)
    Email = data['Email']
    Newpassword =data['Newpassword']
    user = models.User.objects.filter(Email=data['Email']).first()
    if user:
        user_code = list(models.IdentifyingCode.objects.filter(User=user))
        if user_code:
            now_time = datetime.datetime.now(pytz.utc)
            code = data['Checksum']                     #获取传递过来的验证码
            msg = ""
            for item in user_code:
                diff = (now_time-item.Time).seconds
                if 0 <= diff and diff < 1800 :
                    if code == item.Code:
                        user.Password = Newpassword
                        user.save()
                        msg = "设置成功"
                        item.delete()
                        print("设置成功")
                else:
                    item.delete()
            if msg == "":
                msg = "验证码错误"
            
            return HttpResponse(msg)   
        else:
            return HttpResponse("邮箱无验证码")
    else:
        return HttpResponse("邮箱未注册")

def AddCharttoFavor(request):
    data = json.loads(request.body)
    user = models.User.objects.filter(Email=data['Email']).first()
    project = dashboard_models.Project.objects.filter(RepositoryURL=data['repo']).first()

    if user and project:
        #图表基本信息
        chart_name = data['Name']
        chart_type = data['Chart_type']
        data_type = data['Data_type']
        data_detail_type = data['Data_detail_type']
        time_scale = data['Data_time_scale']

        if chart_type == dashboard_models.Chart.BarChart:
            #存储图表的基本信息
            
            if project == []:
                return HttpResponse("项目不存在")
                
            user_chart = dashboard_models.Chart.objects.create(Name=chart_name,ChartType=chart_type,DataType=data_type,DataDetailType=data_detail_type,TimeScale=time_scale)
            user_chart.User.add(user)
            user_chart.project.add(project)
            user_chart.HasProject.add(project)

        elif chart_type == dashboard_models.Chart.PieChart:
            #存储图表的基本信息
            if project == []:
                return HttpResponse("项目不存在")
            user_chart = dashboard_models.Chart.objects.create(Name=chart_name,ChartType=chart_type,DataType=data_type,DataDetailType=data_detail_type,TimeScale=time_scale)
            user_chart.User.add(user)
            user_chart.project.add(project)
            user_chart.HasProject.add(project)

            # #存储图表的数据
            # for xitem, yitem in categoryData, valueData:
            #     key_value_pairs = dashboard_models.DiagramValue.objects.create(key=xitem,value=yitem)
            #     key_value_pairs.Diagram.add(user_diagram)

        
        elif chart_type == dashboard_models.Chart.StackedBarChart or chart_type == dashboard_models.Chart.LineChart:
            user_chart = dashboard_models.Chart.objects.create(Name=chart_name,ChartType=chart_type,DataType=data_type,DataDetailType=data_detail_type,TimeScale=time_scale)
            user_chart.User.add(user)
            user_chart.project.add(project)
            user_chart.HasProject.add(project)
            repolist = data['repo_list']

            for item in repolist:
                #图表对应多个Project
                project_i = dashboard_models.Project.objects.filter(RepositoryURL=item).first()
                if project_i == []:
                    return HttpResponse("有项目不存在")
                user_chart.HasProject.add(project_i)
    else:
        return HttpResponse("邮箱未注册或该项目不存在")

def addFavor(request):
    data = json.loads(request.body)
    user = models.User.objects.filter(Email=data['Email']).first()
    project = dashboard_models.Project.objects.filter(RepositoryURL=data['repo']).first()
    favor = dashboard_models.Favor.objects.create()
    favor.User.add(user)
    favor.Project.add(project)
    return HttpResponse("收藏成功")

def checkFavor(request):
    data = json.loads(request.body)
    user = models.User.objects.filter(Email=data['Email']).first()
    project = dashboard_models.Project.objects.filter(RepositoryURL=data['repo']).first()
    favor = dashboard_models.Favor.objects.filter(User=user,Project=project)
    if favor:
        return HttpResponse("已收藏")
    else:
        return HttpResponse("未收藏")

def deleteFavor(request):
    data = json.loads(request.body)
    user = models.User.objects.filter(Email=data['Email']).first()
    project = dashboard_models.Project.objects.filter(RepositoryURL=data['repo']).first()
    favor = dashboard_models.Favor.objects.filter(User=user,Project=project).delete()
    return HttpResponse("删除成功")

def returnFavor(request):
    data = json.loads(request.body)
    user = models.User.objects.filter(Email=data['Email']).first()
    project = dashboard_models.Project.objects.filter(RepositoryURL=data['repo']).first()

    if user:
        user_chart_list = list(dashboard_models.Chart.objects.filter(User=user,Project=project).order_by('CreatedTime'))
        Chartlist={}
        for chart in user_chart_list:
            
            chart_name = chart.Name
            chart_type = chart.ChartType
            data_type = chart.DataType
            data_detail_type = chart.DataDetailType
            repo_list = list(chart.HasProject)
            time_scale = chart.TimeScale
            created_time = chart.CreatedTime

            Chartlist[created_time]={ 'name':chart_name,'type':chart_type,'data_type':data_detail_type,'time_scale':time_scale,'valueTime':{} }

            valueTime = {}
            Value = {}
            repo_time = {'CommitRecord':[],'IssueRecord':[]}
            repo_value = {}
            for index, repo in range( 0, len(repo_list) ),repo_list:
                repo[index]={'Name':project.Name,'url':project.RepositoryURL,'value':{}}
                repoURL = dashboard_models.AllCommit.objects.values('RepositoryURL').filter(project==repo).first
                for type in data_type.split('_'):
                    if type == "CommitRecord":
                        time = list(dashboard_models.DayCommit.objects.values('Time').filter(project==repo))  
                    elif type == "IssueRecord":
                        time = list(dashboard_models.DayIssue.objects.values('Time').filter(project==repo))
                    repo_time[type] = list(set(time+repo_time[type]))
                

                for type in data_detail_type.split('_'):
                    if type == "committed":
                        value = list(dashboard_models.DayCommit.values('commitCount').filter(project==project))
                    elif type == "changed":
                        value = list(dashboard_models.DayCommit.values('changedCount').filter(project==project))
                    elif type == "added":
                        value = list(dashboard_models.DayCommit.values('addCount').filter(project==project))
                    elif type == "deleted":
                        value = list(dashboard_models.DayCommit.values('deleteCount').filter(project==project))
                    elif type == "opened":
                        value = list(dashboard_models.DayIssue.values('openedCount').filter(project==project))
                    elif type == "closed":
                        value = list(dashboard_models.DayIssue.values('closedCount').filter(project==project))
                    
                    repo_value[type] = value
                Value[repoURL] = repoValue
            valueTime[type] = repoTime
    else:
        return HttpResponse("邮箱未注册")

    