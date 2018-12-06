from django.db import models
from django.contrib.auth.models import User
from rest_framework import serializers

# Create your models here.

PROJECT_STATUS_ENUM_CHOICES = (
    ('0', 'to start'),
    ('1', 'ongoing'), 
    ('2', 'ended'), 
    ('3', 'other'), 
)

class UserRegistration(models.Model):
    def __init__(self):
        user=models.OneToOneField(User)

    def __str__(self):
        return self.user.username
        
class ProjectWork(models.Model):
    pwID = models.AutoField(primary_key=True)
    project_name = models.CharField(max_length=260)
    work_package = models.CharField(max_length=260, blank=True, default='')
    status = models.CharField(choices=PROJECT_STATUS_ENUM_CHOICES, default='1', max_length=10)
    
    def __str__(self):
        if(len(self.work_package)>0):
            return "%s: %s (%05d)" % (self.project_name, self.work_package, self.pwID)
        else:
            return "%s (%05d)" % (self.project_name, self.pwID)

class WorkEffort(models.Model):
    user_name=models.ForeignKey(User, on_delete=models.CASCADE)
    project_work=models.ForeignKey(ProjectWork, on_delete=models.CASCADE)
    work_date=models.DateField()
    work_hours=models.DecimalField(max_digits=4, decimal_places=1)
    work_issue=models.TextField(blank=True, default='')
    
class WorkEffortSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkEffort
        fields = ('id', 'project_name', 'work_package', 'work_date', 'work_hours', 'work_issue')

    project_name = serializers.SerializerMethodField()
    work_package = serializers.SerializerMethodField()

    def get_project_name(self, obj):
        return obj.project_work.project_name
            
    def get_work_package(self, obj):
        return obj.project_work.work_package
