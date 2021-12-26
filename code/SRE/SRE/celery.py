#!/usr/bin/env python3
# -*- coding:utf-8 -*-
# Author:wd
from __future__ import absolute_import, unicode_literals
from datetime import time
import os
from celery import Celery
from celery.schedules import crontab,timedelta

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SRE.settings')  # 设置django环境

app = Celery('SRE')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY') #  使用CELERY_ 作为前缀，在settings中写配置

app.autodiscover_tasks()  # 发现任务文件每个app下的task.py

app.conf.update(
    CELERYBEAT_SCHEDULE={
        'refresh': {
            'task': 'dashboard.tasks.refresh',
            'schedule': crontab(minute='*/2'),    # 每2min执行一次
            # 'schedule': timedelta(seconds=3),
            'args': (),
        },
    }
)