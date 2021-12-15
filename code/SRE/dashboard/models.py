from django.db import models
from register.models import User

class Project(models.Model):
    PID = models.UUIDField(max_length=15, primary_key=True, blank=False)
    Name = models.CharField(max_length=256, blank=False)
    RepositoryURL = models.URLField()
    #参与者？

#从收藏夹里得到用户收藏的PID，然后去Diagram里找
class Favorite(models.Model):
    User = models.ManyToManyField(User)
    PID = models.ManyToManyField(Project)

class Diagram(models.Model):
    User = models.ManyToManyField(User)
    PID = models.ManyToManyField(Project)
    Name = models.CharField(max_length=15)
    #图表类型
    BarChart = 'BarC'
    StackedBarChart = 'SBarC'
    PieChart = 'PIEC'
    Diagram_type_choices = {
        (BarChart, 'BarChart'),
        (StackedBarChart, 'StackedBarChart'),
        (PieChart, 'PieChart')
    }
    Diagram_type = models.CharField(max_length=10, choices=Diagram_type_choices)

    #横纵轴名字
    horizontal_axis_name = models.CharField(max_length=20)
    vertical_axis_name = models.CharField(max_length=20)

    
#每个图对应一个字典
class DiagramValue(models.Model):
    Diagram = models.ManyToManyField(Diagram)
    #柱状图横轴的时间
    Date = models.DateField()   
    #饼状图键值对的键
    Key = models.CharField(max_length=20)
    #y轴的值或者键值对的值
    value = models.DecimalField( max_digits=20, decimal_places=4)

class Contributor(models.Model):
    Project = models.ManyToManyField(Project) #先实验一下看下该主键最终是什么样子的
    Name = models.CharField(max_length=20)
    Github = models.CharField(max_length=30, primary_key=True)
    #贡献量是计算还是存储？

class CommitRecord(models.Model):
    Project = models.ManyToManyField(Project)
    Contributor = models.ManyToManyField(Contributor)
    Time = models.DateTimeField()
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