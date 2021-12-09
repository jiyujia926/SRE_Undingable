from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
import json
import uuid
from . import models
from ...spiders import get_commit,get_issue,get_pullrequest
# def Read_url(request):
def spider(request):
    data = json.loads(request.body)
    address = data['RepositoryURL']
    analyze_commit(address)

def analyze_commit(url:str):
    commitbag = get_commit(url)
    print(commitbag)
