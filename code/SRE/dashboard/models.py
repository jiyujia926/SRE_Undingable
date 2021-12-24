from django.db import models
from django.db.models.deletion import PROTECT
from register.models import User

class Project(models.Model):
    PID = models.UUIDField(max_length=15, primary_key=True, blank=False)
    Name = models.CharField(max_length=255, blank=False)
    State = models.BooleanField()
    RepositoryURL = models.URLField()
    Description = models.TextField(blank=True,null=True,default="亲亲，该仓库暂时没有项目简介噢~")

class Favor(models.Model):
    User = models.ManyToManyField(User)
    Project = models.ManyToManyField(Project)
    Info = models.TextField()

class Chart(models.Model):
    ChartType = models.CharField(max_length=50)
    DataType = models.CharField(max_length=50)
    Position = models.IntegerField()
    TimeScale = models.CharField(max_length=20,default="day", blank=True)
    CheckBox = models.CharField(max_length=50)
    Visible = models.BooleanField(default=True)
    # "open-close" "open" "close" "open-close-merge" "open-merge" "close-merge" "changed-addition-deletion"


class Template(models.Model):
    User = models.ManyToManyField(User)
    Chart = models.ManyToManyField(Chart)
    Name = models.CharField(max_length=255)
    Info = models.TextField()
  
    CreatedTime = models.DateTimeField(auto_now_add=True)



class Contributor(models.Model):
    Project = models.ManyToManyField(Project)
    Github = models.CharField(max_length=255, primary_key=True)
    #贡献量是计算还是存储？

class CommitRecord(models.Model):
    Project = models.ManyToManyField(Project)
    Contributor = models.ManyToManyField(Contributor)
    ChangedFileCount = models.IntegerField(null=True, blank=True)
    AdditionCount = models.IntegerField(null=True, blank=True)
    DeletionCount = models.IntegerField(null=True, blank=True)
    Time = models.DateField()

class OpenIssueRecord(models.Model):
    Contributor = models.ManyToManyField(Contributor)
    Project = models.ManyToManyField(Project)
    Opentime = models.DateField()

class ClosedIssueRecord(models.Model):
    Contributor = models.ManyToManyField(Contributor)
    Project = models.ManyToManyField(Project)
    Opentime = models.DateField()
    Closetime = models.DateField()

class OpenPullrequestRecord(models.Model):
    Contributor = models.ManyToManyField(Contributor)
    Project = models.ManyToManyField(Project)
    Opentime = models.DateField()

class ClosedPullrequestRecord(models.Model):
    Contributor = models.ManyToManyField(Contributor)
    Project = models.ManyToManyField(Project)
    Opentime = models.DateField()
    Closetime = models.DateField()

class MergedPullrequestRecord(models.Model):
    Contributor = models.ManyToManyField(Contributor)
    Project = models.ManyToManyField(Project)
    Opentime = models.DateField()
    Mergetime = models.DateField()


#以天为时间单位，一个项目的总贡献量
class DayCommit(models.Model):
    Project = models.ManyToManyField(Project)
    Time = models.DateField()
    committedCount = models.IntegerField(null=True, blank=True)
    changedCount = models.IntegerField(null=True, blank=True)
    addedCount = models.IntegerField(null=True, blank=True)
    deletedCount = models.IntegerField(null=True, blank=True)

#以月为时间单位，一个项目的总贡献量
class MonthCommit(models.Model):
    Project = models.ManyToManyField(Project)
    Time = models.CharField(max_length=20)
    committedCount = models.IntegerField(null=True, blank=True)
    changedCount = models.IntegerField(null=True, blank=True)
    addedCount = models.IntegerField(null=True, blank=True)
    deletedCount = models.IntegerField(null=True, blank=True)

#以年为时间单位，一个项目的总贡献量
class YearCommit(models.Model):
    Project = models.ManyToManyField(Project)
    Time = models.CharField(max_length=20)
    committedCount = models.IntegerField(null=True, blank=True)
    changedCount = models.IntegerField(null=True, blank=True)
    addedCount = models.IntegerField(null=True, blank=True)
    deletedCount = models.IntegerField(null=True, blank=True)

#以天为时间单位
class DayIssue(models.Model):
    Project = models.ManyToManyField(Project)
    Time = models.DateField()
    closedCount = models.IntegerField(null=True, blank=True)
    openedCount = models.IntegerField(null=True, blank=True)

#以天为时间单位
class DayPullrequest(models.Model):
    Project = models.ManyToManyField(Project)
    Time = models.DateField()
    openedCount = models.IntegerField(null=True, blank=True)
    closedCount = models.IntegerField(null=True, blank=True)
    mergedCount = models.IntegerField(null=True, blank=True)
