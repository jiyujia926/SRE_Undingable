from django.db import models

class Project(models.Model):
    PID = models.UUIDField(max_length=15, primary_key=True, blank=False)
    Name = models.CharField(max_length=10, blank=False)
    ProjectCreatedTime = models.DateTimeField(auto_now=False, auto_created=True)
    RepositoryURL = models.URLField()
    #参与者？

class Contributor(models.Model):
    Project = models.ManyToManyField(Project)
    Name = models.CharField(max_length=20)
    Github = models.CharField(max_length=30)
    #贡献量是计算还是存储？

class Commit(models.Model):
    Project = models.ManyToManyField(Project)
    Time = models.DateField()
    Count = models.IntegerField(null=True, blank=True)

class Merge(models.Model):
    MERGED = 'ME'
    CLOSED = 'CL'
    OPENED = 'OP'
    LOCKED = 'LO'
    Merge_type_choices = {
        (MERGED, 'merged')
        (CLOSED, 'closed')
        (OPENED, 'opened')
        (LOCKED, 'locked')
    }
    Merge_type = models.CharField(max_length=10, choices=Merge_type_choices)
    Project = models.ManyToManyField(Project)
    Time = models.DateField()
    Count = models.IntegerField(null=True, blank=True)  #Submitter总数从commit和merge两个表里拿来计算
    mergedCount = models.IntegerField(null=True, blank=True)
    closedCount = models.IntegerField(null=True, blank=True)
    openedCount = models.IntegerField(null=True, blank=True)
    lockedCount = models.IntegerField(null=True, blank=True)