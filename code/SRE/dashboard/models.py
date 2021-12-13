from django.db import models
from register.models import User

class Project(models.Model):
    PID = models.UUIDField(max_length=15, primary_key=True, blank=False)
    Name = models.CharField(max_length=256, blank=False)
    RepositoryURL = models.URLField()
    #参与者？

#从收藏夹里得到用户收藏的PID，然后去Diagram里找
class Favorite(models.Model):
    User = models.ManyToManyField(User.UID)
    PID = models.ManyToManyField(Project.PID)

class Diagram(models.Model):
    User = models.ManyToManyField(User)
    PID = models.ManyToManyField(Project.PID)

    #图表类型
    LINE = 'LINE'
    HISTOGRAM = 'HG'
    PIE = 'PIE'
    Diagram_type_choices = {
        (LINE, 'line'),
        (HISTOGRAM, 'histogram'),
        (PIE, 'pie')
    }
    Diagram_type = models.CharField(max_length=10, choices=Diagram_type_choices)

    #横纵轴信息
    horizontal_axis = models.CharField(max_length=10)
    vertical_axis = models.CharField(max_length=10)
    #横纵轴范围，以字符串行驶存储，后端需要解析
    horizontal_axis_range = models.CharField(max_length=30)
    vertical_axis_range = models.CharField(max_length=30)

class Contributor(models.Model):
    Project = models.ManyToManyField(Project.PID) #先实验一下看下该主键最终是什么样子的
    Name = models.CharField(max_length=20)
    Github = models.CharField(max_length=30, primary_key=True)
    #贡献量是计算还是存储？

class CommitRecord(models.Model):
    Project = models.ManyToManyField(Project.PID)
    Contributor = models.ManyToManyField(Contributor)
    Time = models.DateField(primary_key=True)
    CommitCount = models.IntegerField(null=True, blank=True)
    ChangedFileCount = models.IntegerField(null=True, blank=True)
    AdditionCount = models.IntegerField(null=True, blank=True)
    DeletionCount = models.IntegerField(null=True, blank=True)

class IssueRecord(models.Model):
    Contributor = models.ManyToManyField(Contributor)
    Project = models.ManyToManyField(Project.PID)

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
    Project = models.ManyToManyField(Project.PID)
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
    Project = models.ManyToManyField(Project.PID)
    Time = models.DateField()
    Count = models.IntegerField(null=True, blank=True)  #Submitter总数从commit和merge两个表里拿来计算
    closedCount = models.IntegerField(null=True, blank=True)
    openedCount = models.IntegerField(null=True, blank=True)