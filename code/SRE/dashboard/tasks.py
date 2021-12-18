from __future__ import absolute_import, unicode_literals
from io import open_code
from django import http
from django.db.models.aggregates import Count, Sum
from celery import shared_task
from .get_commit import getcommit
from .get_issue import get_open_issue,get_closed_issue
from . import models
import django
from django.http import HttpResponse
django.setup()  					# 前4句引入django测试环境
import pandas as pd
import datetime
import pytz


@shared_task
def spider(url:str):
    analyze_commit(url)
    initialcommitdata(url)
    # analyze_open_issue(url)
    # analyze_close_issue(url)
@shared_task
def threespider(request):
    return HttpResponse("wdnmd")
@shared_task
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

@shared_task
def analyze_open_issue(url:str):
    openissuelist = get_open_issue(url)
    project = models.Project.objects.filter(RepositoryURL=url).first()
    if openissuelist:
        for item in openissuelist:
            openissue = models.OpenIssueRecord.objects.create(Opentime=item['opentime'])
            openissue.Project.add(project)
            for name in item['participator']:
                NameList = list(models.Contributor.objects.values().filter(Name=name))
                if NameList:
                    contributor = models.Contributor.objects.filter(Name=name).first()
                    if project not in contributor.Project.all():
                        contributor.Project.add(project)
                else:
                    contributor = models.Contributor.objects.create(Name=name,Github=name)
                    contributor.Project.add(project)
            openissue.Contributor.add(contributor)
        
@shared_task
def analyze_close_issue(url:str):
    closeissuelist = get_closed_issue(url)
    project = models.Project.objects.filter(RepositoryURL=url).first()
    if closeissuelist:
        for item in closeissuelist:
            closeissue = models.ClosedIssueRecord.objects.create(Opentime=item['opentime'],Closetime=item['closetime'])
            closeissue.Project.add(project)
            for name in item['participator']:
                NameList = list(models.Contributor.objects.values().filter(Name=name))
                if NameList:
                    contributor = models.Contributor.objects.filter(Name=name).first()
                    if project not in contributor.Project.all():
                        contributor.Project.add(project)
                else:
                    contributor = models.Contributor.objects.create(Name=name,Github=name)
                    contributor.Project.add(project)
            closeissue.Contributor.add(contributor)

@shared_task
def initialcommitdata(url:str):
    
    project = models.Project.objects.filter(RepositoryURL=url).first()
    
    project_commit = models.CommitRecord.objects.values().filter(Project=project)
    Daylist = list(project_commit.values('Time').order_by('Time').annotate(Commit=Count(id),Change=Sum('ChangedFileCount'),Add=Sum('AdditionCount'),Delete=Sum('DeletionCount')))
     #print(list1)
    Month={}
    Year={}
    for item in Daylist:
        time = str(item['Time']).split('-')
        monthtime = time[0]+"-"+time[1]
        yeartime = time[0]
        if monthtime in Month.keys():
            Month[monthtime]['Commit'] = Month[monthtime]['Commit'] + item['Commit']
            Month[monthtime]['Change'] = Month[monthtime]['Change'] + item['Change']
            Month[monthtime]['Add'] = Month[monthtime]['Add'] + item['Add']
            Month[monthtime]['Delete'] = Month[monthtime]['Delete'] + item['Delete']
        else :
            Month[monthtime] = {'Commit':item['Commit'], 'Change':item['Change'], 'Add':item['Add'], 'Delete':item['Delete']}

        if yeartime in Year.keys():
            Year[yeartime]['Commit'] = Year[yeartime]['Commit'] + item['Commit']
            Year[yeartime]['Change'] = Year[yeartime]['Change'] + item['Change']
            Year[yeartime]['Add'] = Year[yeartime]['Add'] + item['Add']
            Year[yeartime]['Delete'] = Year[yeartime]['Delete'] + item['Delete']
        else:
            Year[yeartime] = {'Commit':item['Commit'], 'Change':item['Change'], 'Add':item['Add'], 'Delete':item['Delete']}
    # print(Month)
    # print(Year)

    for item in Daylist:
        daycommit = models.DayCommit.objects.create(Time=item['Time'],committedCount=item['Commit'],changedCount=item['Change'],addedCount=item['Add'],deletedCount=item['Delete'])
        daycommit.Project.add(project)

    for item in Month:
        print(item)
        monthcommit = models.MonthCommit.objects.create(Time=item,committedCount=Month[item]['Commit'],changedCount=Month[item]['Change'],addedCount=Month[item]['Add'],deletedCount=Month[item]['Delete'])
        monthcommit.Project.add(project)

    for item in Year:
        print(item)
        yearcommit = models.YearCommit.objects.create(Time=item,committedCount=Year[item]['Commit'],changedCount=Year[item]['Change'],addedCount=Year[item]['Add'],deletedCount=Year[item]['Delete'])
        yearcommit.Project.add(project)
    print("initial1")
    proj=models.Project.objects.get(RepositoryURL=url)
    proj.State=1
    proj.save()
    print("initial2")

@shared_task
def initialissuedata(url:str):
    
    project = models.Project.objects.filter(RepositoryURL=url).first()
    
    project_issue = models.OpenIssueRecord.objects.values().filter(Project=project)
    open_Daylist = list(project_issue.values('Opentime').order_by('Opentime').annotate(open_issue=Count(id)))
    close_Daylist = list(project_issue.values('CloseTime').order_by('CloseTime').annotate(close_issue=Count(id)))

    time_list = get_date_list(open_Daylist[0]['Opentime'], datetime.now().day())
    #在close的对应时间减去相应的open_issue数量，以最开始的open和最后的close作为结束，后续open数量保持不变，close为0，例如：
    #open:{12-11:4,12-12:5},close:{12-13:8}；则补全后：open:{12-11:4,12-12:9,12-13:1},close:{12-11:0,12-12:0,12-13:8}
    
    openCount = 0
    openSum = 0
    closeCount = 0
    closeSum = 0
    Daylist = {'open':[],'close':[]}
    for item in time_list:
        if item in open_Daylist[openCount].keys():
            closeSum += close_Daylist[openCount][item]
            Daylist['open'].append(openSum)
        else:
            Daylist['open'].append(open_Daylist[openCount][item])

        if open_Daylist[openCount][item]:
            openSum += open_Daylist[openCount][item]
            Daylist['open'].append(openSum)
        else:
            Daylist['open'].append(open_Daylist[openCount][item])

    Month={}
    Year={}
    for item in Daylist:
        time = str(item['Time']).split('-')
        monthtime = time[0]+"-"+time[1]
        yeartime = time[0]
        if monthtime in Month.keys():
            Month[monthtime]['Commit'] = Month[monthtime]['Commit'] + item['Commit']
            Month[monthtime]['Change'] = Month[monthtime]['Change'] + item['Change']
            Month[monthtime]['Add'] = Month[monthtime]['Add'] + item['Add']
            Month[monthtime]['Delete'] = Month[monthtime]['Delete'] + item['Delete']
        else :
            Month[monthtime] = {'Commit':item['Commit'], 'Change':item['Change'], 'Add':item['Add'], 'Delete':item['Delete']}

        if yeartime in Year.keys():
            Year[yeartime]['Commit'] = Year[yeartime]['Commit'] + item['Commit']
            Year[yeartime]['Change'] = Year[yeartime]['Change'] + item['Change']
            Year[yeartime]['Add'] = Year[yeartime]['Add'] + item['Add']
            Year[yeartime]['Delete'] = Year[yeartime]['Delete'] + item['Delete']
        else:
            Year[yeartime] = {'Commit':item['Commit'], 'Change':item['Change'], 'Add':item['Add'], 'Delete':item['Delete']}
    # print(Month)
    # print(Year)

    for item in Daylist:
        daycommit = models.DayCommit.objects.create(Time=item['Time'],committedCount=item['Commit'],changedCount=item['Change'],addedCount=item['Add'],deletedCount=item['Delete'])
        daycommit.Project.add(project)

    for item in Month:
        print(item)
        monthcommit = models.MonthCommit.objects.create(Time=item,committedCount=Month[item]['Commit'],changedCount=Month[item]['Change'],addedCount=Month[item]['Add'],deletedCount=Month[item]['Delete'])
        monthcommit.Project.add(project)

    for item in Year:
        print(item)
        yearcommit = models.YearCommit.objects.create(Time=item,committedCount=Year[item]['Commit'],changedCount=Year[item]['Change'],addedCount=Year[item]['Add'],deletedCount=Year[item]['Delete'])
        yearcommit.Project.add(project)
    print("initial1")
    proj=models.Project.objects.get(RepositoryURL=url)
    proj.State=1
    proj.save()
    print("initial2")

def get_date_list(begin_date, end_date):
    date_list = [x.strftime('%Y-%m-%d') for x in list(pd.date_range(start=begin_date, end=end_date))]
    return date_list

def test(request):
    url = "https://github.com/jiyujia926/NFTauction/"
    Email= "3190103367@zju.edu.cn"
    user = models.User.objects.filter(Email=Email).first()
    project = models.Project.objects.filter(RepositoryURL=url).first()
    project_commit = models.CommitRecord.objects.values().filter(Project=project)
    Daylist = list(project_commit.values('Time').order_by('Time').annotate(Commit=Count(id),Change=Sum('ChangedFileCount'),Add=Sum('AdditionCount'),Delete=Sum('DeletionCount')))

    # list1 = get_date_list(Daylist[0]['Time'],datetime.datetime.now().day())
    print(datetime.datetime.now())
    # print(Daylist[0]['Time'])
    # print(Daylist[0]['Time'].strftime('%y-%m-%d'))
    # if list1[0] == Daylist[0]['Time'].strftime('%Y-%m-%d'):
    #     print("sss")
    return HttpResponse("2222")