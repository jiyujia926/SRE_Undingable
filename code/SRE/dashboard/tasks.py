from __future__ import absolute_import, unicode_literals
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