from django.db import models
from register.models import User

class Project(models.Model):
    PID = models.UUIDField(max_length=15, primary_key=True, blank=False)
    Name = models.CharField(max_length=256, blank=False)
    RepositoryURL = models.URLField()
    #参与者？

class Favorite(models.Model):
    User = models.ManyToManyField(User)
    RepositoryURL = models.URLField()

class Contributor(models.Model):
    Project = models.ManyToManyField(Project) #先实验一下看下该主键最终是什么样子的
    Name = models.CharField(max_length=20)
    Github = models.CharField(max_length=30, primary_key=True)
    #贡献量是计算还是存储？

class CommitRecord(models.Model):
    Project = models.ManyToManyField(Project)
    Contributor = models.ManyToManyField(Contributor)
    Time = models.DateField(primary_key=True)
    CommitCount = models.IntegerField(null=True, blank=True)
    ChangedFileCount = models.IntegerField(null=True, blank=True)
    AdditionCount = models.IntegerField(null=True, blank=True)
    DeletionCount = models.IntegerField(null=True, blank=True)

class IssueRecord(models.Model):
    Contributor = models.ManyToManyField(Contributor)
    Project = models.ManyToManyField(Project)

    CLOSED = 'CL'
    OPENED = 'OP'
    Issue_type_choices = {
        (CLOSED, 'closed'),
        (OPENED, 'opened')
    }
    Issue_type = models.CharField(max_length=10, choices=Issue_type_choices)
    
    IssueOpenCount = models.IntegerField(null=True, blank=True)
    IssueCloseCount = models.IntegerField(null=True, blank=True)
    OpenTime = models.DateField()
    CloseTime = models.DateField()

#以天为时间单位，一个项目的总贡献量
class AllCommit(models.Model):
    Project = models.ManyToManyField(Project)
    Time = models.DateField()
    Count = models.IntegerField(null=True, blank=True)

class AllIssue(models.Model):
    CLOSED = 'CL'
    OPENED = 'OP'
    Issue_type_choices = {
        (CLOSED, 'closed'),
        (OPENED, 'opened')
    }
    Issue_type = models.CharField(max_length=10, choices=Issue_type_choices)
    Project = models.ManyToManyField(Project)
    Time = models.DateField()
    Count = models.IntegerField(null=True, blank=True)  #Submitter总数从commit和merge两个表里拿来计算
    closedCount = models.IntegerField(null=True, blank=True)
    openedCount = models.IntegerField(null=True, blank=True)