from __future__ import absolute_import, unicode_literals
from io import open_code
from bs4.element import ProcessingInstruction
from django import http
from django.db.models.aggregates import Count, Sum
from celery import shared_task
from .get_commit import getcommit
from .get_issue import get_open_issue,get_closed_issue
from .get_pullrequest import get_open_pullrequest,get_closed_pullrequest
from . import models
from django.db.models import F
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
    analyze_open_issue(url)
    analyze_close_issue(url)
    initialissuedata(url)
    analyze_open_pullrequest(url)
    analyze_close_merge_pullrequest(url)
    initial_pullrequest_data(url)
    print("initial1")
    proj=models.Project.objects.get(RepositoryURL=url)
    proj.State=1
    proj.save()
    print("initial2")
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
                NameList = list(models.Contributor.objects.values().filter(Github=name))
                if NameList:
                    contributor = models.Contributor.objects.filter(Github=name).first()
                    if project not in contributor.Project.all():
                        contributor.Project.add(project)
                else:
                    contributor = models.Contributor.objects.create(Github=name)
                    contributor.Project.add(project)
                openissue.Contributor.add(contributor)
    print("open issue ok")
        
@shared_task
def analyze_close_issue(url:str):
    closeissuelist = get_closed_issue(url)
    project = models.Project.objects.filter(RepositoryURL=url).first()
    if closeissuelist:
        for item in closeissuelist:
            closeissue = models.ClosedIssueRecord.objects.create(Opentime=item['opentime'],Closetime=item['closetime'])
            closeissue.Project.add(project)
            for name in item['participator']:
                NameList = list(models.Contributor.objects.values().filter(Github=name))
                if NameList:
                    contributor = models.Contributor.objects.filter(Github=name).first()
                    if project not in contributor.Project.all():
                        contributor.Project.add(project)
                else:
                    contributor = models.Contributor.objects.create(Github=name)
                    contributor.Project.add(project)
                closeissue.Contributor.add(contributor)
    print("close issue ok")
@shared_task
def analyze_open_pullrequest(url:str):
    openprbag = get_open_pullrequest(url)
    project = models.Project.objects.filter(RepositoryURL=url).first()
    if openprbag:
        for item in openprbag:
            openpr = models.OpenPullrequestRecord.objects.create(Opentime=item['opentime'])
            openpr.Project.add(project)
            for name in item['participator']:
                Namelist = list(models.Contributor.objects.values().filter(Github=name))
                if Namelist:
                    contributor = models.Contributor.objects.filter(Github=name).first()
                    if project not in contributor.Project.all():
                        contributor.Project.add(project)
                else:
                    contributor = models.Contributor.objects.create(Github=name)
                    contributor.Project.add(project)
                openpr.Contributor.add(contributor)
    print("open pr ok")

@shared_task
def analyze_close_merge_pullrequest(url:str):
    cormbag = get_closed_pullrequest(url)
    project = models.Project.objects.filter(RepositoryURL=url).first()
    if cormbag:
        for item in cormbag:
            if item['status']=="closed":
                closepr = models.ClosedPullrequestRecord.objects.create(Opentime=item['opentime'],Closetime=item['closetime'])
                closepr.Project.add(project)
                for name in item['participator']:
                    Namelist = list(models.Contributor.objects.values().filter(Github=name))
                    if Namelist:
                        contributor = models.Contributor.objects.filter(Github=name).first()
                        if project not in contributor.Project.all():
                            contributor.Project.add(project)
                    else:
                        contributor = models.Contributor.objects.create(Github=name)
                        contributor.Project.add(project)
                    closepr.Contributor.add(contributor)
            else:
                mergepr = models.MergedPullrequestRecord.objects.create(Opentime=item['opentime'],Mergetime=item['mergetime'])
                mergepr.Project.add(project)
                for name in item['participator']:
                    Namelist = list(models.Contributor.objects.values().filter(Github=name))
                    if Namelist:
                        contributor = models.Contributor.objects.filter(Github=name).first()
                        if project not in contributor.Project.all():
                            contributor.Project.add(project)
                    else:
                        contributor = models.Contributor.objects.create(Github=name)
                        contributor.Project.add(project)
                    mergepr.Contributor.add(contributor)
    print("close or merge ok")
                        
                    
            
@shared_task
def initialcommitdata(url:str):
    
    project = models.Project.objects.filter(RepositoryURL=url).first()
    
    project_commit = models.CommitRecord.objects.values().filter(Project=project)
    Daylist = list(project_commit.values('Time').order_by('Time').annotate(Commit=Count(id),Change=Sum('ChangedFileCount'),Add=Sum('AdditionCount'),Delete=Sum('DeletionCount')))
     #print(list1)

    if Daylist == []:
        return

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
    # print("initial1")
    # proj=models.Project.objects.get(RepositoryURL=url)
    # proj.State=1
    # proj.save()
    # print("initial2")

@shared_task
def initialissuedata(url:str):
    project = models.Project.objects.filter(RepositoryURL=url).first()
    project_open_issue = models.OpenIssueRecord.objects.values().filter(Project=project)
    project_closed_issue = models.ClosedIssueRecord.objects.values().filter(Project=project)
    open_Daylist = list(project_open_issue.values('Opentime').order_by('Opentime').annotate(open_issue=Count(id)))
    closed_Daylist = list(project_closed_issue.values('Closetime').order_by('Closetime').annotate(closed_issue=Count(id)))
    opened_Daylist = list(project_closed_issue.values('Opentime').order_by('Opentime').annotate(opened_issue=Count(id)))

    if open_Daylist == [] and closed_Daylist == []:
        # return HttpResponse("no issue")
        return

    list1=[]
    list2=[]
    if open_Daylist != []:
        list1.append(open_Daylist[0]['Opentime'])
        list2.append(open_Daylist[len(open_Daylist)-1]['Opentime'])
    
    if closed_Daylist != []:
        list1.append(closed_Daylist[0]['Closetime'])
        list2.append(closed_Daylist[len(closed_Daylist)-1]['Closetime'])

    if opened_Daylist != []:
        list1.append(opened_Daylist[0]['Opentime'])
        list2.append(opened_Daylist[len(opened_Daylist)-1]['Opentime'])

    start_time = min(list1)
    end_time = max(list2)
    time_list = get_date_list(start_time,end_time)

    #到目前为止仍在开启的issue的数组index和数量
    open_count = 0
    open_sum = 0

    #到目前为止已经关闭的issue的数组index和数量
    closed_count = 0
    closed_sum = 0

    #到目前为止曾经开启的issue的数组index和数量
    opened_count = 0
    opened_sum = 0
    Daylist = {'Open':[],'Closed':[]}

    # print(open_Daylist)
    # print(close_Daylist)
    # print(opened_Daylist)
    # print(len(open_Daylist))
    for item in time_list:
        time = datetime.datetime.strptime(item, '%Y-%m-%d').date()
        
        if closed_count<len(closed_Daylist) and time == closed_Daylist[closed_count]['Closetime']:
            closed_sum += closed_Daylist[closed_count]['closed_issue']
            closed_count += 1

        Daylist['Closed'].append(closed_sum)
        
        if opened_count<len(opened_Daylist) and time == opened_Daylist[opened_count]['Opentime']:
            opened_sum += opened_Daylist[opened_count]['opened_issue']
            opened_count += 1

        if open_count<len(open_Daylist) and time == open_Daylist[open_count]['Opentime']:
            open_sum += open_Daylist[open_count]['open_issue']
            open_count += 1

        Daylist['Open'].append(open_sum+opened_sum-closed_sum)
    # print(Daylist['Open'])
    # print(Daylist['Close'])
    for index in range(0,len(time_list)):
        day_issue = models.DayIssue.objects.create(Time=time_list[index],closedCount=Daylist['Closed'][index],openedCount=Daylist['Open'][index])
        day_issue.Project.add(project)
    
    # print("initial1")
    # proj=models.Project.objects.get(RepositoryURL=url)
    # proj.State=1
    # proj.save()
    # print("initial2")

@shared_task
def initial_pullrequest_data(url:str):
    project = models.Project.objects.filter(RepositoryURL=url).first()
    project_open_pr = models.OpenPullrequestRecord.objects.values().filter(Project=project)
    project_closed_pr = models.ClosedPullrequestRecord.objects.values().filter(Project=project)
    project_merged_pr = models.MergedPullrequestRecord.objects.values().filter(Project=project)

    open_Daylist = list(project_open_pr.values('Opentime').order_by('Opentime').annotate(open_pullrequest=Count(id)))

    closed_Daylist = list(project_closed_pr.values('Closetime').order_by('Closetime').annotate(closed_pullrequest=Count(id)))
    opened_closed_Daylist = list(project_closed_pr.values('Opentime').order_by('Opentime').annotate(opened_pullrequest=Count(id)))
    
    merged_Daylist = list(project_merged_pr.values('Mergetime').order_by('Mergetime').annotate(merged_pullrequest=Count(id)))
    opened_merged_Daylist = list(project_merged_pr.values('Opentime').order_by('Opentime').annotate(opened_pullrequest=Count(id)))

    if open_Daylist == [] and closed_Daylist == [] and merged_Daylist == []:
        # return HttpResponse("no Pull request")
        return

    #确定时间范围
    list1 = []
    list2 = []
    if open_Daylist != []:
        list1.append(open_Daylist[0]['Opentime'])
        list2.append(open_Daylist[len(open_Daylist)-1]['Opentime'])
    if closed_Daylist != []:
        list1.append(closed_Daylist[0]['Closetime'])
        list2.append(closed_Daylist[len(closed_Daylist)-1]['Closetime'])
    if merged_Daylist != []:
        list1.append(merged_Daylist[0]['Mergetime'])
        list2.append(merged_Daylist[len(merged_Daylist)-1]['Mergetime'])
    if opened_closed_Daylist != []:
        list1.append(opened_closed_Daylist[0]['Opentime'])
        list2.append(opened_closed_Daylist[len(opened_closed_Daylist)-1]['Opentime'])
    if opened_merged_Daylist != []:
        list1.append(opened_merged_Daylist[0]['Opentime'])
        list2.append(opened_merged_Daylist[len(opened_merged_Daylist)-1]['Opentime'])

    start_time = min(list1)
    end_time = max(list2)
    time_list = get_date_list(start_time,end_time)

    #到目前为止仍在等待的pull request的数组index和数量
    open_count = 0
    open_sum = 0

    #到目前为止已经关闭的pull request的数组index和数量
    closed_count = 0
    closed_sum = 0

    #到目前为止已经merge的pull request的数组index和数量
    merged_count = 0
    merged_sum = 0

    #到目前为止曾经等待最终关闭的pull reques的数组index和数量
    opened_closed_count = 0
    opened_closed_sum = 0

    #到目前为止曾经等待最终merge的pull request的数组index和数量
    opened_merged_count = 0
    opened_merged_sum = 0

    Daylist = {'Open':[],'Closed':[],'Merged':[]}

    for item in time_list:
        time = datetime.datetime.strptime(item, '%Y-%m-%d').date()
        
        if closed_count<len(closed_Daylist) and time == closed_Daylist[closed_count]['Closetime']:
            closed_sum += closed_Daylist[closed_count]['closed_pullrequest']
            closed_count += 1
        Daylist['Closed'].append(closed_sum)

        if merged_count<len(merged_Daylist) and time == merged_Daylist[merged_count]['Mergetime']:
            merged_sum += merged_Daylist[merged_count]['merged_pullrequest']
            merged_count += 1
        Daylist['Merged'].append(merged_sum)
        
        if opened_closed_count<len(opened_closed_Daylist) and time == opened_closed_Daylist[opened_closed_count]['Opentime']:
            opened_closed_sum += opened_closed_Daylist[opened_closed_count]['opened_pullrequest']
            opened_closed_count += 1
        
        if opened_merged_count<len(opened_merged_Daylist) and time == opened_merged_Daylist[opened_merged_count]['Opentime']:
            opened_merged_sum += opened_merged_Daylist[opened_merged_count]['opened_pullrequest']
            opened_merged_count += 1

        if open_count<len(open_Daylist) and time == open_Daylist[open_count]['Opentime']:
            open_sum += open_Daylist[open_count]['open_pullrequest']
            open_count += 1
        Daylist['Open'].append(open_sum + opened_closed_sum + opened_merged_sum - closed_sum - opened_closed_sum)

    for index in range(0,len(time_list)):
        day_pullrequest = models.DayPullrequest.objects.create(Time=time_list[index],openedCount=Daylist['Open'][index],closedCount=Daylist['Closed'][index],mergedCount=Daylist['Merged'][index])
        day_pullrequest .Project.add(project)
    
    

def get_date_list(begin_date, end_date):
    date_list = [x.strftime('%Y-%m-%d') for x in list(pd.date_range(start=begin_date, end=end_date))]
    return date_list

@shared_task
def delete_project(url:str):
    project = models.Project.objects.filter(RepositoryURL=url).first()
    #删除contributor信息
    delete_contributor(url)
    #删除commit信息
    delete_commit(url)
    #删除issue信息
    delete_issue(url)
    #删除pull request信息
    delete_pullrequest(url)
    project.delete()

def delete_contributor(url:str):
    project = models.Project.objects.filter(RepositoryURL=url).first()
    check = models.Contributor.objects.filter(Project=project).all()
    if check:
        check.delete()
        return True
    else:
        return False

def delete_commit(url:str):
    project = models.Project.objects.filter(RepositoryURL=url).first()
    check = models.CommitRecord.objects.filter(Project=project).all()
    if check:
        check.delete()
        models.DayCommit.objects.filter(Project=project).all().delete()
        models.MonthCommit.objects.filter(Project=project).all().delete()
        models.YearCommit.objects.filter(Project=project).all().delete()
        return True
    else:
        return False

def delete_issue(url:str):
    project = models.Project.objects.filter(RepositoryURL=url).first()
    check_open = models.OpenIssueRecord.objects.filter(Project=project).all()
    check_closed = models.ClosedIssueRecord.objects.filter(Project=project).all() 
    if check_open and check_closed:
        check_open.delete()
        check_closed.delete()
        models.DayIssue.objects.filter(Project=project).all().delete()
        return True
    else:
        return False

def delete_pullrequest(url:str):
    project = models.Project.objects.filter(RepositoryURL=url).first()
    check_open = models.OpenPullrequestRecord.objects.filter(Project=project).all()
    check_closed = models.ClosedPullrequestRecord.objects.filter(Project=project).all()
    check_merged = models.MergedPullrequestRecord.objects.filter(Project=project).all()
    if check_open and check_closed and check_merged:
        check_open.delete()
        check_closed.delete()
        check_merged.delete()
        models.DayPullrequest.objects.filter(Project=project).all().delete()
        return True
    else:
        return False

def test(request):
    url = "https://github.com/donnemartin/system-design-primer/"
    Email= "3190103367@zju.edu.cn"
    user = models.User.objects.filter(Email=Email).first()
    project = models.Project.objects.filter(RepositoryURL=url).first()

    # Pr = models.Project.objects.values('RepositoryURL').all()
    # print(Pr)
    # for item in Pr:
    #     print(item['RepositoryURL'])
    if project:
        return HttpResponse("sss")
    else:
        return HttpResponse("aaa")
    