from django import forms
from django.contrib.auth.models import User
from tracker_app.models import UserRegistration, ProjectWork, WorkEffort
from datetime import date

class UserRegistrationForm(forms.ModelForm):
    first_name=forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Firstname'}))
    last_name=forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Lastname'}))
    username=forms.CharField(widget=forms.TextInput(attrs={'placeholder':'Username'}))
    password= forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Password'}))

    class Meta():
        model=User
        fields=('first_name','last_name','username','password')

class WorkEffortsForm(forms.ModelForm):
    project_work = forms.ModelChoiceField(queryset=ProjectWork.objects.all())
    
    #project_name=forms.CharField(max_length=260,widget=forms.TextInput(attrs={'class':'form-control form-control-sm'}))
    #work_package=forms.CharField(max_length=260,widget=forms.TextInput(attrs={'class':'form-control form-control-sm'}))
    
    work_date=forms.DateField(widget=forms.widgets.DateInput(attrs={'type': 'date','class':'form-control form-control-date'}))
    work_hours=forms.CharField(max_length=8,widget=forms.NumberInput(attrs={'class':'form-control form-control-sm'}))
    work_issue=forms.CharField(required=False, widget=forms.Textarea(attrs={'class':'form-control form-control-sm form-control-textarea'}))

    class Meta():
        model=WorkEffort
        exclude=('user_name',)

class ViewUserEffortForm(forms.ModelForm):

    class Meta():
        model=WorkEffort
        fields=('user_name',)
