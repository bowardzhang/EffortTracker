from django.contrib import admin
from tracker_app.models import UserRegistration, ProjectWork, WorkEffort

@admin.register(ProjectWork)
class ProjectWorkAdmin(admin.ModelAdmin):
  #date_hierarchy = 'work_date'
  search_fields = ['project_name', 'work_package', 'status']
  list_display = ('pwID', 'project_name','work_package', 'status')
  
@admin.register(WorkEffort)
class WorkEffortAdmin(admin.ModelAdmin):
  date_hierarchy = 'work_date'
  search_fields = ['user_name', 'project_work']
  list_display = ('user_name','project_work', 'work_date', 'work_hours')
  #list_filter = ('status',)
  
# Register your models here.
admin.site.register(UserRegistration)
