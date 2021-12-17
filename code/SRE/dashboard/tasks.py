from __future__ import absolute_import, unicode_literals
from django.db.models.aggregates import Count, Sum
from celery import shared_task
from .get_commit import getcommit
from .get_issue import get_open_issue,get_closed_issue
from . import models
import django
django.setup()  					# 前4句引入django测试环境


@shared_task
def spider(url:str):
    analyze_commit(url)
    analyze_open_issue(url)
    analyze_close_issue(url)

@shared_task
def analyze_commit(url:str):
    commitbag = getcommit(url)
    project = models.Project.objects.filter(RepositoryURL=url).first()
    if commitbag:
        for item in commitbag:
            NameList = list(models.Contributor.objects.values().filter(Name=item['commitor']))
            if NameList:
                contributor = models.Contributor.objects.filter(Name=item['commitor']).first()
                if project not in contributor.Project.all():
                    contributor.Project.add(project)
            else:
                contributor = models.Contributor.objects.create(Name=item['commitor'],Github=item['commitor'])
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
    # project = models.Project.objects.filter(RepositoryURL=url).first()
    # list1 = list(models.CommitRecord.objects.values().filter(Project=project).order_by('Time'))
    # print(list1)
    # timelist = []
    # valuelist = []
    # commitlist = []
    
    # timecommitdict = {}
    # for commitrecord in list1:
    #     thistime = commitrecord['Time']
    #     # print(thistime)
    #     if thistime in timecommitdict.keys():
    #         timecommitdict[thistime]['CommitCount'] = timecommitdict[thistime]['CommitCount'] + 1
    #         timecommitdict[thistime]['ChangedFileCount'] = timecommitdict[thistime]['ChangedFileCount'] + commitrecord['ChangedFileCount']
    #         timecommitdict[thistime]['AdditionCount'] = timecommitdict[thistime]['AdditionCount'] + commitrecord['AdditionCount']
    #         timecommitdict[thistime]['DeletionCount'] = timecommitdict[thistime]['DeletionCount'] + commitrecord['DeletionCount']
    #     else:
    #         timecommitdict[thistime] = {'CommitCount':1,'ChangedFileCount':commitrecord['ChangedFileCount'],'AdditionCount':commitrecord['AdditionCount'],'DeletionCount':commitrecord['DeletionCount']}
    # # print(timecommitdict)
    # timelist = list(timecommitdict.keys())
    # valuelist = list(timecommitdict.values())
    # # print(timelist)
    # # print(valuelist)
    # for i in range(0,len(timelist)):
    #     allcommit = models.DayCommit.objects.create(Time=timelist[i],committedCount=valuelist[i]['CommitCount'],changedCount=valuelist[i]['ChangedFileCount'],addedCount=valuelist[i]['AdditionCount'],deletedCount=valuelist[i]['DeletionCount'])
    #     allcommit.Project.add(project)
    # # commitlist = list(models.AllCommit.objects.values().filter(Project=project).order_by('Time'))
    # # print(commitlist)

    project = models.Project.objects.filter(RepositoryURL=url).first()
    #如果已经完成，直接返回
    if project.State:
        return
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