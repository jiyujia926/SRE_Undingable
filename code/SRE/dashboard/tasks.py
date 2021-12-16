from __future__ import absolute_import, unicode_literals
from celery import shared_task
from .get_commit import getcommit
from .get_issue import open_issue_time
from . import models
import django
django.setup()  					# 前4句引入django测试环境


@shared_task
def spider(url:str):
    analyze_commit(url)

@shared_task
def analyze_commit(url:str):
    commitbag = getcommit(url)
    project = models.Project.objects.filter(RepositoryURL=url).first()
    for item in commitbag:
        NameList = list(models.Contributor.objects.values().filter(Name=item['commitor']))
        if NameList:
            contributor = models.Contributor.objects.filter(Name=item['commitor']).first()
        else:
            contributor = models.Contributor.objects.create(Name=item['commitor'],Github=item['commitor'])
            contributor.Project.add(project)
        commitRecord = models.CommitRecord.objects.create(Time=item['commit_time'],ChangedFileCount=item['changed_file'],AdditionCount=item['additions'],DeletionCount=item['deletions'])
        commitRecord.Project.add(project)
        commitRecord.Contributor.add(contributor)

@shared_task
def analyze_open_issue(url:str):
    openissuelist = open_issue_time(url)
    project = models.Project.objects.filter(RepositoryURL=url).first()
    for item in openissuelist:
        models.IssueRecord.objects.create(Issue_type="opened")