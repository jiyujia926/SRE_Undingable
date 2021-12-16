from django.db import models
from django.db.models.deletion import PROTECT
from register.models import User

class Project(models.Model):
    PID = models.UUIDField(max_length=15, primary_key=True, blank=False)
    Name = models.CharField(max_length=255, blank=False)
    State = models.BooleanField()
    RepositoryURL = models.URLField()

class Chart(models.Model):
    User = models.ManyToManyField(User)
    project = models.ManyToManyField(Project, related_name='Project')
    HasProject = models.ManyToManyField(Project, related_name='HasProject')
    Name = models.CharField(max_length=255)
    #图表类型
    BarChart = '1'
    StackedBarChart = '2'
    PieChart = '3'
    LineChart = '4'
    Chart_type_choices = {
        (BarChart, 'BarChart'),
        (StackedBarChart, 'StackedBarChart'),
        (PieChart, 'PieChart'),
        (LineChart, 'LineChart')
    }

    #数据类型
    # Commit = 'commit'
    # Changed = 'changed'
    # Add = 'add'
    # Delete = 'delete'
    # Open = 'open'
    # Close = 'close'
    # Data_type_choices = {
    #     (Commit, 'Commit'),
    #     (Changed, 'Changed'),
    #     (Add, 'Add'),
    #     (Delete, 'Delete'),
    #     (Open, 'Open'),
    #     (Close, 'Close')
    # }

    ChartType = models.CharField(max_length=10, choices=Chart_type_choices)
    DataType = models.CharField(max_length=50)
    DataDetailType = models.CharField(max_length=100)



class Contributor(models.Model):
    Project = models.ManyToManyField(Project) #先实验一下看下该主键最终是什么样子的
    Github = models.CharField(max_length=255, primary_key=True)
    #贡献量是计算还是存储？

class CommitRecord(models.Model):
    Project = models.ManyToManyField(Project)
    Contributor = models.ManyToManyField(Contributor)
    ChangedFileCount = models.IntegerField(null=True, blank=True)
    AdditionCount = models.IntegerField(null=True, blank=True)
    DeletionCount = models.IntegerField(null=True, blank=True)
    Time = models.DateField()

# class IssueRecord(models.Model):
#     Contributor = models.ManyToManyField(Contributor)
#     Project = models.ManyToManyField(Project)

#     CLOSED = 'CL'
#     OPENED = 'OP'
#     Issue_type_choices = {
#         (CLOSED, 'closed'),
#         (OPENED, 'opened')
#     }
#     Issue_type = models.CharField(max_length=10, choices=Issue_type_choices)
    
#     IssueOpenCount = models.IntegerField(null=True, blank=True)
#     IssueCloseCount = models.IntegerField(null=True, blank=True)
#     OpenTime = models.DateField()
#     CloseTime = models.DateField()
class OpenIssueRecord(models.Model):
    Contributor = models.ManyToManyField(Contributor)
    Project = models.ManyToManyField(Project)
    Opentime = models.DateField()

class ClosedIssueRecord(models.Model):
    Contributor = models.ManyToManyField(Contributor)
    Project = models.ManyToManyField(Project)
    Opentime = models.DateField()
    CloseTime = models.DateField()

#以天为时间单位，一个项目的总贡献量
class AllCommit(models.Model):
    Project = models.ManyToManyField(Project)
    Time = models.DateField()
    committedCount = models.IntegerField(null=True, blank=True)
    changedCount = models.IntegerField(null=True, blank=True)
    addedCount = models.IntegerField(null=True, blank=True)
    deletedCount = models.IntegerField(null=True, blank=True)

class AllIssue(models.Model):
    Project = models.ManyToManyField(Project)
    Time = models.DateField()
    Count = models.IntegerField(null=True, blank=True)
    closedCount = models.IntegerField(null=True, blank=True)
    openedCount = models.IntegerField(null=True, blank=True)