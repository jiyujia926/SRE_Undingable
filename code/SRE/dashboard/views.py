from django.db.models.aggregates import Count,Sum
from django.db.models import F
from django.http.response import ResponseHeaders
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from operator import itemgetter
from itertools import groupby
# Create your views here.
import json
import uuid

from requests.api import get
from . import models
from register.models import User as rUser
from .tryvisit import tryvisit
from .get_commit import getcommit
from .get_issue import get_open_issue,get_closed_issue
from .get_pullrequest import get_open_pullrequest,get_closed_pullrequest
from dashboard import tasks

# def Read_url(request):
def checkurl(request):
    data = json.loads(request.body)
    address = str(data['RepositoryURL'])
    if address[-1] == '/':
            pass
    else:
        address = address + '/'
    print(address)
    list1 = list(models.Project.objects.values().filter(RepositoryURL=address))
    if list1:
        # 这个链接仓库里有
        # print(list1[0]['RepositoryURL']==address)
        # spideissue(address)
        # tasks.initialcommitdata.delay(address)
        # dotest(address)
        # importDB(address)
        return HttpResponse("true")
    else:
        # 这个链接仓库里没有
        if tryvisit(address)==404 or address.count('/') != 5:
            # print(tryvisit(address))
            return HttpResponse("仓库不存在或未开源")
        else:
            name = address[18:-1]
            project = models.Project(PID=uuid.uuid4(),Name=name,RepositoryURL=address,State=False)
            project.save()
            importDB(address)
            # spider(address)
            return HttpResponse("添加进数据库")

# def analyze_commit(url:str):
#     commitbag = getcommit(url)
#     print(commitbag)
def spideissue(url:str):
    infolist = get_open_issue(url)
    print(infolist)
    infolist = get_closed_issue(url)
    print(infolist)


def get_data(request):
    data = json.loads(request.body)
    print(data)
    addresslist = data['Address']
    if len(addresslist)==1:
        return HttpResponse(get_one_address(addresslist[0],data['Datatype'],data['Charttype']))
    else:
        datatype=data['Datatype']
        charttype = data['Charttype']
        address1 = addresslist[0]
        address2 = addresslist[1]
        project1 = list(models.Project.objects.values().filter(RepositoryURL=address1))
        project2 = list(models.Project.objects.values().filter(RepositoryURL=address2))
        repo1=project1[0]['Name'][1:]
        repo2=project2[0]['Name'][1:]
        firstbag=json.loads(get_one_address(address1,datatype,charttype))
        secondbag=json.loads(get_one_address(address2,datatype,charttype))
        if datatype=="commit":
            timespan1 = firstbag['day']['categoryData']
            databag1 = firstbag['day']['valueData'][0]['detailData']
            timespan2 = secondbag['day']['categoryData']
            databag2 = secondbag['day']['valueData'][0]['detailData']
            timespan3 = timespan1+timespan2
            newtimespan = []
            for time in timespan3:
                if time not in newtimespan:
                    newtimespan.append(time)
            newtimespan.sort()
            # print(newtimespan)
            # print(databag1)
            # print(databag2)
            newdatabag1=[]
            newdatabag2=[]
            for time in newtimespan:
                if time in timespan1:
                    newdatabag1.append(databag1[timespan1.index(time)])
                else:
                    newdatabag1.append(0)
                if time in timespan2:
                    newdatabag2.append(databag2[timespan2.index(time)])
                else:
                    newdatabag2.append(0)
            # print(newdatabag1)
            # print(newdatabag2)
            day={'categoryData':newtimespan,'valueData':[{'repo':repo1,'name':'commit','detailData':newdatabag1},{'repo':repo2,'name':"commit",'detailData':newdatabag2}]}
            timespan1 = firstbag['month']['categoryData']
            databag1 = firstbag['month']['valueData'][0]['detailData']
            timespan2 = secondbag['month']['categoryData']
            databag2 = secondbag['month']['valueData'][0]['detailData']
            timespan3 = timespan1+timespan2
            newtimespan = []
            for time in timespan3:
                if time not in newtimespan:
                    newtimespan.append(time)
            newtimespan.sort()
            # print(newtimespan)
            # print(databag1)
            # print(databag2)
            newdatabag1=[]
            newdatabag2=[]
            for time in newtimespan:
                if time in timespan1:
                    newdatabag1.append(databag1[timespan1.index(time)])
                else:
                    newdatabag1.append(0)
                if time in timespan2:
                    newdatabag2.append(databag2[timespan2.index(time)])
                else:
                    newdatabag2.append(0)
            # print(newdatabag1)
            # print(newdatabag2)
            month={'categoryData':newtimespan,'valueData':[{'repo':repo1,'name':'commit','detailData':newdatabag1},{'repo':repo2,'name':"commit",'detailData':newdatabag2}]}
            timespan1 = firstbag['year']['categoryData']
            databag1 = firstbag['year']['valueData'][0]['detailData']
            timespan2 = secondbag['year']['categoryData']
            databag2 = secondbag['year']['valueData'][0]['detailData']
            timespan3 = timespan1+timespan2
            newtimespan = []
            for time in timespan3:
                if time not in newtimespan:
                    newtimespan.append(time)
            newtimespan.sort()
            # print(newtimespan)
            # print(databag1)
            # print(databag2)
            newdatabag1=[]
            newdatabag2=[]
            for time in newtimespan:
                if time in timespan1:
                    newdatabag1.append(databag1[timespan1.index(time)])
                else:
                    newdatabag1.append(0)
                if time in timespan2:
                    newdatabag2.append(databag2[timespan2.index(time)])
                else:
                    newdatabag2.append(0)
            # print(newdatabag1)
            # print(newdatabag2)
            year={'categoryData':newtimespan,'valueData':[{'repo':repo1,'name':'commit','detailData':newdatabag1},{'repo':repo2,'name':"commit",'detailData':newdatabag2}]}
            databag={'day':day,'month':month,'year':year}
        elif datatype=="issue":
            timespan1 = firstbag['day']['categoryData']
            opendatabag1 = firstbag['day']['valueData'][0]['detailData']
            closedatabag1 = firstbag['day']['valueData'][1]['detailData']
            timespan2 = secondbag['day']['categoryData']
            opendatabag2 = secondbag['day']['valueData'][0]['detailData']
            closedatabag2 = secondbag['day']['valueData'][1]['detailData']
            timespan3 = timespan1+timespan2
            newtimespan = []
            for time in timespan3:
                if time not in newtimespan:
                    newtimespan.append(time)
            newtimespan.sort()
            newopendatabag1 = []
            newclosedatabag1 = []
            newopendatabag2 = []
            newclosedatabag2 = []
            for time in newtimespan:
                if time in timespan1:
                    newopendatabag1.append(opendatabag1[timespan1.index(time)])
                    newclosedatabag1.append(closedatabag1[timespan1.index(time)])
                else:
                    if time < timespan1[0]:
                        newopendatabag1.append(0)
                        newclosedatabag1.append(0)
                    elif time > timespan1[-1]:
                        newopendatabag1.append(opendatabag1[-1])
                        newclosedatabag1.append(closedatabag1[-1])
                if time in timespan2:
                    newopendatabag2.append(opendatabag2[timespan2.index(time)])
                    newclosedatabag2.append(closedatabag2[timespan2.index(time)])
                else:
                    if time < timespan2[0]:
                        newopendatabag2.append(0)
                        newclosedatabag2.append(0)
                    elif time > timespan2[-1]:
                        newopendatabag2.append(opendatabag2[-1])
                        newclosedatabag2.append(closedatabag2[-1])
            day={'categoryData':newtimespan,'valueData':[{'repo':repo1,'name':'open','detailData':newopendatabag1},
                                                        {'repo':repo1,'name':'closed','detailData':newclosedatabag1},
                                                        {'repo':repo2,'name':'open','detailData':newopendatabag2},
                                                        {'repo':repo2,'name':'closed','detailData':newclosedatabag2}]}
            databag={'day':day,'month':[],'year':[]}
        elif datatype=="subcommit":
            timespan1 = firstbag['day']['categoryData']
            adddatabag1 = firstbag['day']['valueData'][0]['detailData']
            changedatabag1 = firstbag['day']['valueData'][1]['detailData']
            removedatabag1 = firstbag['day']['valueData'][2]['detailData']
            timespan2 = secondbag['day']['categoryData']
            adddatabag2 = secondbag['day']['valueData'][0]['detailData']
            changedatabag2 = secondbag['day']['valueData'][1]['detailData']
            removedatabag2 = secondbag['day']['valueData'][2]['detailData']
            timespan3 = timespan1+timespan2
            newtimespan = []
            for time in timespan3:
                if time not in newtimespan:
                    newtimespan.append(time)
            newtimespan.sort()
            newadddatabag1=[]
            newchangedatabag1=[]
            newremovedatabag1=[]
            newadddatabag2=[]
            newchangedatabag2=[]
            newremovedatabag2=[]
            for time in newtimespan:
                if time in timespan1:
                    newadddatabag1.append(adddatabag1[timespan1.index(time)])
                    newchangedatabag1.append(changedatabag1[timespan1.index(time)])
                    newremovedatabag1.append(removedatabag1[timespan1.index(time)])
                else:
                    newadddatabag1.append(0)
                    newchangedatabag1.append(0)
                    newremovedatabag1.append(0)
                if time in timespan2:
                    newadddatabag2.append(adddatabag2[timespan2.index(time)])
                    newchangedatabag2.append(changedatabag2[timespan2.index(time)])
                    newremovedatabag2.append(removedatabag2[timespan2.index(time)])
                else:
                    newadddatabag2.append(0)
                    newchangedatabag2.append(0)
                    newremovedatabag2.append(0)
            day={'categoryData':newtimespan,'valueData':[{'repo':repo1,'name':"addition",'detailData':newadddatabag1},
                                                        {'repo':repo1,'name':'changedfile','detailData':newchangedatabag1},
                                                        {'repo':repo1,'name':'deletion','detailData':newremovedatabag1},
                                                        {'repo':repo2,'name':"addition",'detailData':newadddatabag2},
                                                        {'repo':repo2,'name':'changedfile','detailData':newchangedatabag2},
                                                        {'repo':repo2,'name':'deletion','detailData':newremovedatabag2}]}
            timespan1 = firstbag['month']['categoryData']
            adddatabag1 = firstbag['month']['valueData'][0]['detailData']
            changedatabag1 = firstbag['month']['valueData'][1]['detailData']
            removedatabag1 = firstbag['month']['valueData'][2]['detailData']
            timespan2 = secondbag['month']['categoryData']
            adddatabag2 = secondbag['month']['valueData'][0]['detailData']
            changedatabag2 = secondbag['month']['valueData'][1]['detailData']
            removedatabag2 = secondbag['month']['valueData'][2]['detailData']
            timespan3 = timespan1+timespan2
            newtimespan = []
            for time in timespan3:
                if time not in newtimespan:
                    newtimespan.append(time)
            newtimespan.sort()
            newadddatabag1=[]
            newchangedatabag1=[]
            newremovedatabag1=[]
            newadddatabag2=[]
            newchangedatabag2=[]
            newremovedatabag2=[]
            for time in newtimespan:
                if time in timespan1:
                    newadddatabag1.append(adddatabag1[timespan1.index(time)])
                    newchangedatabag1.append(changedatabag1[timespan1.index(time)])
                    newremovedatabag1.append(removedatabag1[timespan1.index(time)])
                else:
                    newadddatabag1.append(0)
                    newchangedatabag1.append(0)
                    newremovedatabag1.append(0)
                if time in timespan2:
                    newadddatabag2.append(adddatabag2[timespan2.index(time)])
                    newchangedatabag2.append(changedatabag2[timespan2.index(time)])
                    newremovedatabag2.append(removedatabag2[timespan2.index(time)])
                else:
                    newadddatabag2.append(0)
                    newchangedatabag2.append(0)
                    newremovedatabag2.append(0)
            month={'categoryData':newtimespan,'valueData':[{'repo':repo1,'name':"addition",'detailData':newadddatabag1},
                                                        {'repo':repo1,'name':'changedfile','detailData':newchangedatabag1},
                                                        {'repo':repo1,'name':'deletion','detailData':newremovedatabag1},
                                                        {'repo':repo2,'name':"addition",'detailData':newadddatabag2},
                                                        {'repo':repo2,'name':'changedfile','detailData':newchangedatabag2},
                                                        {'repo':repo2,'name':'deletion','detailData':newremovedatabag2}]}    
            timespan1 = firstbag['year']['categoryData']
            adddatabag1 = firstbag['year']['valueData'][0]['detailData']
            changedatabag1 = firstbag['year']['valueData'][1]['detailData']
            removedatabag1 = firstbag['year']['valueData'][2]['detailData']
            timespan2 = secondbag['year']['categoryData']
            adddatabag2 = secondbag['year']['valueData'][0]['detailData']
            changedatabag2 = secondbag['year']['valueData'][1]['detailData']
            removedatabag2 = secondbag['year']['valueData'][2]['detailData']
            timespan3 = timespan1+timespan2
            newtimespan = []
            for time in timespan3:
                if time not in newtimespan:
                    newtimespan.append(time)
            newtimespan.sort()
            newadddatabag1=[]
            newchangedatabag1=[]
            newremovedatabag1=[]
            newadddatabag2=[]
            newchangedatabag2=[]
            newremovedatabag2=[]
            for time in newtimespan:
                if time in timespan1:
                    newadddatabag1.append(adddatabag1[timespan1.index(time)])
                    newchangedatabag1.append(changedatabag1[timespan1.index(time)])
                    newremovedatabag1.append(removedatabag1[timespan1.index(time)])
                else:
                    newadddatabag1.append(0)
                    newchangedatabag1.append(0)
                    newremovedatabag1.append(0)
                if time in timespan2:
                    newadddatabag2.append(adddatabag2[timespan2.index(time)])
                    newchangedatabag2.append(changedatabag2[timespan2.index(time)])
                    newremovedatabag2.append(removedatabag2[timespan2.index(time)])
                else:
                    newadddatabag2.append(0)
                    newchangedatabag2.append(0)
                    newremovedatabag2.append(0)
            year={'categoryData':newtimespan,'valueData':[{'repo':repo1,'name':"addition",'detailData':newadddatabag1},
                                                        {'repo':repo1,'name':'changedfile','detailData':newchangedatabag1},
                                                        {'repo':repo1,'name':'deletion','detailData':newremovedatabag1},
                                                        {'repo':repo2,'name':"addition",'detailData':newadddatabag2},
                                                        {'repo':repo2,'name':'changedfile','detailData':newchangedatabag2},
                                                        {'repo':repo2,'name':'deletion','detailData':newremovedatabag2}]}
            databag={'day':day,'month':month,'year':year}
        elif datatype=="pullrequest":
            timespan1 = firstbag['day']['categoryData']
            opendatabag1 = firstbag['day']['valueData'][0]['detailData']
            closedatabag1 = firstbag['day']['valueData'][1]['detailData']
            mergedatabag1 = firstbag['day']['valueData'][2]['detailData']
            timespan2 = secondbag['day']['categoryData']
            opendatabag2 = secondbag['day']['valueData'][0]['detailData']
            closedatabag2 = secondbag['day']['valueData'][1]['detailData']
            mergedatabag2 = secondbag['day']['valueData'][2]['detailData']
            timespan3 = timespan1+timespan2
            newtimespan = []
            for time in timespan3:
                if time not in newtimespan:
                    newtimespan.append(time)
            newtimespan.sort()
            newopendatabag1 = []
            newclosedatabag1 = []
            newmergedatabag1 = []
            newopendatabag2 = []
            newclosedatabag2 = []
            newmergedatabag2 = []
            for time in newtimespan:
                if time in timespan1:
                    newopendatabag1.append(opendatabag1[timespan1.index(time)])
                    newclosedatabag1.append(closedatabag1[timespan1.index(time)])
                    newmergedatabag1.append(mergedatabag1[timespan1.index(time)])
                else:
                    if time < timespan1[0]:
                        newopendatabag1.append(0)
                        newclosedatabag1.append(0)
                        newmergedatabag1.append(0)
                    elif time > timespan1[-1]:
                        newopendatabag1.append(opendatabag1[-1])
                        newclosedatabag1.append(closedatabag1[-1])
                        newmergedatabag1.append(mergedatabag1[-1])
                if time in timespan2:
                    newopendatabag2.append(opendatabag2[timespan2.index(time)])
                    newclosedatabag2.append(closedatabag2[timespan2.index(time)])
                    newmergedatabag2.append(mergedatabag2[timespan2.index(time)])
                else:
                    if time < timespan2[0]:
                        newopendatabag2.append(0)
                        newclosedatabag2.append(0)
                        newmergedatabag2.append(0)
                    elif time > timespan2[-1]:
                        newopendatabag2.append(opendatabag2[-1])
                        newclosedatabag2.append(closedatabag2[-1])
                        newmergedatabag2.append(mergedatabag2[-1])
            day={'categoryData':newtimespan,'valueData':[{'repo':repo1,'name':'open','detailData':newopendatabag1},
                                                        {'repo':repo1,'name':'closed','detailData':newclosedatabag1},
                                                        {'repo':repo1,'name':'merged','detailData':newmergedatabag1},
                                                        {'repo':repo2,'name':'open','detailData':newopendatabag2},
                                                        {'repo':repo2,'name':'closed','detailData':newclosedatabag2},
                                                        {'repo':repo2,'name':'merged','detailData':newmergedatabag2}]}
            databag={'day':day,'month':[],'year':[]}
        elif datatype=="contributor":
            pass
        return HttpResponse(json.dumps(databag))

def get_one_address(address:str,datatype:str,charttype:str):

    # address="https://github.com/Bitergia/prosoul/"
    if address[-1] == '/':
        pass
    else:
        address = address + '/'
    # datatype = data['DataType']
    # charttype = data['ChartType']
    # timescale = data['TimeScale']
    project = models.Project.objects.filter(RepositoryURL=address).first()
    projname=""
    proj =models.Project.objects.values('Name').filter(RepositoryURL=address)
    if proj:
        projname=proj[0]['Name'][1:]
    if charttype == "piechart":
        return {}
    else:
        if datatype == "commit":
            daycommitlist = list(models.DayCommit.objects.values().filter(Project=project).order_by('Time'))
            daytimelist=[]
            daycommitcntlist=[]
            for daycommitrecord in daycommitlist:
                daytimelist.append(str(daycommitrecord['Time']))
                daycommitcntlist.append(daycommitrecord['committedCount'])
            # print(commitlist)
            daycommit={'categoryData':daytimelist,'valueData':[{'repo':projname,'name':"commit",'detailData':daycommitcntlist}]}
            monthcommitlist = list(models.MonthCommit.objects.values().filter(Project=project).order_by('Time'))
            monthtimelist=[]
            monthcommitcntlist=[]
            for monthcommitrecord in monthcommitlist:
                monthtimelist.append(str(monthcommitrecord['Time']))
                monthcommitcntlist.append(monthcommitrecord['committedCount'])
            monthcommit={'categoryData':monthtimelist,'valueData':[{'repo':projname,'name':"commit",'detailData':monthcommitcntlist}]}
            yearcommitlist = list(models.YearCommit.objects.values().filter(Project=project).order_by('Time'))
            yeartimelist=[]
            yearcommitcntlist=[]
            for yearcommitrecord in yearcommitlist:
                yeartimelist.append(str(yearcommitrecord['Time']))
                yearcommitcntlist.append(yearcommitrecord['committedCount'])
            yearcommit={'categoryData':yeartimelist,'valueData':[{'repo':projname,'name':"commit",'detailData':yearcommitcntlist}]}
            databag={'day':daycommit,'month':monthcommit,'year':yearcommit}
            return json.dumps(databag)
        elif datatype == "subcommit":
            daycommitlist = list(models.DayCommit.objects.values().filter(Project=project).order_by('Time'))
            daytimelist=[]
            dayaddlist=[]
            daychangelist=[]
            dayremovelist=[]
            for daycommitrecord in daycommitlist:
                daytimelist.append(str(daycommitrecord['Time']))
                dayaddlist.append(daycommitrecord['addedCount'])
                daychangelist.append(daycommitrecord['changedCount'])
                dayremovelist.append(daycommitrecord['deletedCount'])
            day={'categoryData':daytimelist,'valueData':[{'repo':projname,'name':'addition','detailData':dayaddlist},{'repo':projname,'name':'changedfile','detailData':daychangelist},{'repo':projname,'name':'deletion','detailData':dayremovelist}]}
            monthcommitlist = list(models.MonthCommit.objects.values().filter(Project=project).order_by('Time'))
            monthtimelist=[]
            monthaddlist=[]
            monthchangelist=[]
            monthremovelist=[]
            for monthcommitrecord in monthcommitlist:
                monthtimelist.append(str(monthcommitrecord['Time']))
                monthaddlist.append(monthcommitrecord['addedCount'])
                monthchangelist.append(monthcommitrecord['changedCount'])
                monthremovelist.append(monthcommitrecord['deletedCount'])
            month={'categoryData':monthtimelist,'valueData':[{'repo':projname,'name':'addition','detailData':monthaddlist},{'repo':projname,'name':'changedfile','detailData':monthchangelist},{'repo':projname,'name':'deletion','detailData':monthremovelist}]}
            yearcommitlist = list(models.YearCommit.objects.values().filter(Project=project).order_by('Time'))
            yeartimelist=[]
            yearaddlist=[]
            yearchangelist=[]
            yearremovelist=[]
            for yearcommitrecord in yearcommitlist:
                yeartimelist.append(str(yearcommitrecord['Time']))
                yearaddlist.append(yearcommitrecord['addedCount'])
                yearchangelist.append(yearcommitrecord['changedCount'])
                yearremovelist.append(yearcommitrecord['deletedCount'])
            year={'categoryData':yeartimelist,'valueData':[{'repo':projname,'name':'addition','detailData':yearaddlist},{'repo':projname,'name':'changedfile','detailData':yearchangelist},{'repo':projname,'name':'deletion','detailData':yearremovelist}]}
            databag={'day':day,'month':month,'year':year}
            return json.dumps(databag)
        elif datatype == "issue":
            dayissuelist = list(models.DayIssue.objects.values().filter(Project=project).order_by('Time'))
            daytimelist = []
            dayopenlist = []
            daycloselist = []
            for dayissuerecord in dayissuelist:
                daytimelist.append(str(dayissuerecord['Time']))
                dayopenlist.append(dayissuerecord['openedCount'])
                daycloselist.append(dayissuerecord['closedCount'])
            day={'categoryData':daytimelist,'valueData':[{'repo':projname,'name':'open','detailData':dayopenlist},{'repo':projname,'name':'closed','detailData':daycloselist}]}
            databag={"day":day,'month':[],'year':[]}
            return json.dumps(databag)
        elif datatype == "pullrequest":
            daypullrequestlist = list(models.DayPullrequest.objects.values().filter(Project=project).order_by('Time'))
            daytimelist = []
            dayopenlist = []
            daycloselist = []
            daymergelist = []
            for daypullrequestrecord in daypullrequestlist:
                daytimelist.append(str(daypullrequestrecord['Time']))
                dayopenlist.append(daypullrequestrecord['openedCount'])
                daycloselist.append(daypullrequestrecord['closedCount'])
                daymergelist.append(daypullrequestrecord['mergedCount'])
            day={'categoryData':daytimelist,'valueData':[{'repo':projname,'name':'open','detailData':dayopenlist},{'repo':projname,'name':'closed','detailData':daycloselist},{'repo':projname,'name':'merged','detailData':daymergelist}]}
            databag={"day":day,'month':[],'year':[]}
            return json.dumps(databag)
        elif datatype == "contributor":
            pass
            return 
    
    # databag = {'categoryData':timelist,'valueData':commitcountlist}
    # return HttpResponse(json.dumps(databag))

    
def get_contributor_issue(url:str):
    project = models.Project.objects.filter(RepositoryURL=url[0]).first()
    list1 = list(models.OpenIssueRecord.objects.values(name=F('Contributor')).filter(Project=project).annotate(value=Count(id)))
    list2 = list(models.ClosedIssueRecord.objects.values(name=F('Contributor')).filter(Project=project).annotate(value=Count(id)))
    list3 = list1+list2
    list3.sort(key=itemgetter('name'))
    list4 = []
    for name, items in groupby(list3, key=itemgetter('name')):
        dict={'name':"", 'value':0}
        # print(name)
        dict['name']=name
        for i in items:
            # print(' ',i)
            dict['value']+=i['value']
        list4.append(dict)
    #从大到小排序
    list4.sort(key=lambda item:item['value'], reverse=True)
    # print(list4)

    return list4

def get_contributor_pullrequest(url:str):
    project = models.Project.objects.filter(RepositoryURL=url).first()
    list1 = list(models.OpenPullrequestRecord.objects.values(name=F('Contributor')).filter(Project=project).annotate(value=Count(id)))
    list2 = list(models.ClosedPullrequestRecord.objects.values(name=F('Contributor')).filter(Project=project).annotate(value=Count(id)))
    list3 = list(models.MergedPullrequestRecord.objects.values(name=F('Contributor')).filter(Project=project).annotate(value=Count(id)))
    
    list4 = list1+list2+list3
    list4.sort(key=itemgetter('name'))
    list5 = []
    for name, items in groupby(list4, key=itemgetter('name')):
        dict={'name':"",'value':0}
        dict['name'] = name
        for i in items:
            dict['value']+=i['value']
        list5.append(dict)
    #从大到小排序
    list1=sorted(list5, key=lambda item:item['value'], reverse=True)
    return list5

def get_contributor_data(request):
    data = json.loads(request.body)
    Addresslist = data['Address']
    key = ['first','second']
    dict = {}
    for item, index in zip(Addresslist,range(0,len(Addresslist))):
        project = models.Project.objects.filter(RepositoryURL=item).first()

        if project:
            type = data['Datatype']
            if type=="issue":
                list=get_contributor_issue(item)
            elif type=="pullrequest":
                list=get_contributor_pullrequest(item)
            dict[key[index]]=list
            
        else:
            return HttpResponse("该项目不存在")
    return HttpResponse(json.dumps(dict))

def servetwo(url:list):
    return
    
    
def spider(url:str):
    analyze_commit(url)

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
       
def checkstate(request):
    data = json.loads(request.body)
    address = data['Address']
    if address[-1] == '/':
        pass
    else:
        address = address + '/'
    # address = "https://github.com/jiyujia926/NFTauction/"
    projlist = list(models.Project.objects.values().filter(RepositoryURL=address))
    if projlist[0]['State']:
        return HttpResponse("爬好了")
    else:
        return HttpResponse("还在爬")
    

def customize(request):
    data = json.loads(request.body)
    # print(data)
    template = models.Template.objects.create(Name=data['Name'],Info=data['Description'])
    template.save()
    user = rUser.objects.filter(Email=data['Email']).first()
    template.User.add(user)
    for chartitem in data['Dashboard']:
        chart = models.Chart.objects.create(ChartType=chartitem['ChartType'],
                                            DataType=chartitem['DataType'],
                                            Position=chartitem['Position'],
                                            TimeScale=chartitem['TimeScale'],
                                            CheckBox=chartitem['CheckBox'],
                                            Visible=chartitem['Visible'])
        chart.save()
        template.Chart.add(chart)
    return HttpResponse("定制成功")

def fetchcustomize(request):
    data = json.loads(request.body)
    user = rUser.objects.filter(Email=data['Email']).first()
    res=[]
    templatelist = models.Template.objects.values().filter(User=user)
    # print(templatelist)
    for template in templatelist:
        templatedict={'Name':template['Name'],'Id':template['id'],'Time':str(template['CreatedTime']),'Description':template['Info']}
        chartall=[]
        templateob = models.Template.objects.get(id=template['id'])
        chartlist = list(templateob.Chart.values().all())
        for chart in chartlist:
            # print(chart)
            chartall.append({'Position':chart['Position'],'DataType':chart['DataType'],'ChartType':chart['ChartType'],
                             'TimeScale':chart['TimeScale'],'CheckBox':chart['CheckBox'],'Visible':chart['Visible']})
        templatedict['Dashboard']=chartall
        res.append(templatedict)    
    print(res)    
    return HttpResponse(json.dumps(res))
    
def deletecustomize(request):
    data = json.loads(request.body)
    user = rUser.objects.filter(Email=data['Email']).first()
    template = models.Template.objects.filter(User=user, id=data['Id']).first()
    chartlist = models.Template.objects.values('Chart').filter(User=user, id=data['Id']).all()
    if template:
        template.delete()
        for item in chartlist:
            chart = models.Chart.objects.filter(id=item['Chart']).first()
            chart.delete()
        return HttpResponse("删除成功")
    else:
        return HttpResponse("删除失败")

# def initialcontributor(url:str):
    
#celery tasks
def importDB(url:str):
    tasks.spider.delay(url)
def dotest(url:str):
    tasks.spider.delay(url)


def test(request):
    url = ["https://github.com/microsoft/CodeBERT/","https://github.com/Bitergia/prosoul/"]
    key = ['first', 'second']
    project = models.Project.objects.filter(RepositoryURL=url[0]).first()
    list1 = list(models.OpenIssueRecord.objects.values(name=F('Contributor')).filter(Project=project).annotate(value=Count(id)))
    list2 = list(models.ClosedIssueRecord.objects.values(name=F('Contributor')).filter(Project=project).annotate(value=Count(id)))
    list3 = list1+list2
    list3.sort(key=itemgetter('name'))
    list4 = []
    for name, items in groupby(list3, key=itemgetter('name')):
        dict={'name':"", 'value':0}
        print(name)
        dict['name']=name
        for i in items:
            print(' ',i)
            dict['value']+=i['value']
        list4.append(dict)
    list4.sort(key=lambda item:item['value'], reverse=True)
    print(list4)
    return HttpResponse(json.dumps(list4))
    return HttpResponse("sssss")
