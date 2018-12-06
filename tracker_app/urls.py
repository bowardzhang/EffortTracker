from django.urls import path
from tracker_app import views

app_name='tracker_app'

urlpatterns = [
    path('register/',views.register,name='register'),
    path('userinfo/',views.userinfo,name='userinfo'),
    path('vieweffort/',views.vieweffort,name='vieweffort'),
    path('listeffort/',views.listeffort,name='listeffort'),
    path('recordeffort/',views.recordeffort,name='recordeffort'),
    path('generatereport/',views.generatereport,name='generatereport'),
    path('reporttemplate/',views.reporttemplate,name='reporttemplate'),
    path('reporttemplateinfo/',views.reporttemplateinfo,name='reporttemplateinfo'),
    path('deleteeffort/',views.deleteeffort,name='deleteeffort'),
    path('userrecord/',views.userrecord,name='userrecord'),
    path('password/',views.change_password,name='change_password'),
]
