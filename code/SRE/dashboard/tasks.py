from __future__ import absolute_import, unicode_literals
from celery import shared_task
import time
import django
from .get_commit import getcommit
django.setup()  					# 前4句引入django测试环境
from dashboard.models import Project

@shared_task
def add(x, y):
    time.sleep(10)
    return x + y


@shared_task
def mul(x, y):
    return x * y

@shared_task
def spider(url:str):
    analyze_commit(url)

@shared_task
def analyze_commit(url:str):
    commitbag = getcommit(url)
    print(commitbag)