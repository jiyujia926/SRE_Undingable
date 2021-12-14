from __future__ import absolute_import, unicode_literals
from celery import shared_task
from .get_commit import getcommit
from . import models
import django
django.setup()  					# 前4句引入django测试环境


@shared_task
def spider(url:str, PID:str):
    analyze_commit(url, PID)

@shared_task
def analyze_commit(url:str, PID:str):
    commitbag = getcommit(url)
    for item in commitbag:
        commitrecord = models.CommitRecord(Project=PID,Contributor=item['commitor'],Time=item['commit_time'],ChangedFileCount=item['changed_file'],AdditionCount=item['additions'],DeletionCount=item['deletions'])
        commitrecord.save()