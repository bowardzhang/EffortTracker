from django.shortcuts import render,redirect
from tracker_app.forms import UserRegistrationForm, WorkEffortsForm, ViewUserEffortForm
from django.http import HttpResponse,HttpResponseRedirect,JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.urls.base import reverse
from django.contrib.auth  import login,logout,authenticate
from django.forms import *
from tracker_app.models import User, UserRegistration, WorkEffort, WorkEffortSerializer
from django.db.models import Q

from django.contrib import messages
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm

# Create your views here.

# @login_required
def user_logout(request):
    logout(request)
    return redirect('/login/')


def user_login(request):
    if request.method=='POST':
        username=request.POST['username']
        password=request.POST['password']
        user=authenticate(request,username=username,password=password)
        if user:
            if user.is_active:
                login(request,user)

                session_user={'id':user.id,'username':user.username,'first_name':user.first_name.upper(),'last_name':user.last_name.upper(),'is_superuser':user.is_superuser}
                # user_logged=User.objects.values()
                # print(user_logged);
                request.session['session_user']=session_user
                user_form=WorkEffortsForm()
                user_dict={
                'v_firstname':session_user['first_name'],
                'v_lastname':session_user['last_name'],
                'is_superuser':session_user['is_superuser'],
                'form':user_form
                }

                return render(request,'tracker_app/userpage.html',user_dict)

                # return redirect('/tracker_app/userinfo')
            else:
                raise forms.ValidationError("You user account is not active!")
        else:
            return render(request,'tracker_app/login.html',{'v_error':'Username/Password incorrect!!'})
    else:
        return render(request,'tracker_app/login.html')


def register(request):
    registration_page=True
    registered=False
    if request.method=='POST':
        user_registerform=UserRegistrationForm(request.POST)
        if user_registerform.is_valid:
            user=user_registerform.save(commit=False)
            user.set_password(user.password)
            user.save()
            registered=True
        else:
            print(user_registerform.errors)
    else:
        user_registerform=UserRegistrationForm()


    return render(request,'tracker_app/register.html',context={'user_form':user_registerform,'registered':registered,'registration_page':registration_page})

@login_required
def userinfo(request):

    #get the user session info
    session_user=request.session.get('session_user')
    user_form=WorkEffortsForm()
    user_dict={
    'v_firstname':session_user['first_name'],
    'v_lastname':session_user['last_name'],
    'is_superuser':session_user['is_superuser'],
    'form':user_form
    }

    return render(request,'tracker_app/userpage.html',user_dict)

@login_required
def vieweffort(request):
    session_user=request.session.get('session_user')
    user_list=ViewUserEffortForm()
    user_dict={
    'v_firstname':session_user['first_name'],
    'v_lastname':session_user['last_name'],
    'is_superuser':session_user['is_superuser'],
    'user_list':user_list

    }
    return render(request,'tracker_app/viewefforts.html',user_dict)

@csrf_exempt
def listeffort(request):
    session_user=request.session.get('session_user')
    effort_list=[]
    from_date=request.POST['fromdate']
    to_date=request.POST['todate']

    if len(list(request.POST))>2:
        if from_date=="" and to_date=="":
            effort_list=WorkEffort.objects.filter(user_name_id=request.POST['user_id'],project_work__status="1")
        else:
            effort_list=WorkEffort.objects.filter(work_date__gte=from_date,work_date__lte=to_date,user_name_id=request.POST['user_id'],project_work__status="1")
    else:
        if from_date=="" and to_date=="":
            effort_list=WorkEffort.objects.filter(user_name_id=session_user['id'],project_work__status="1")
        else:
            effort_list=WorkEffort.objects.filter(work_date__gte=from_date, work_date__lte=to_date, user_name_id=session_user['id'],project_work__status="1")

    effort_list = WorkEffortSerializer(effort_list, many=True).data
    return JsonResponse(effort_list ,safe=False)

@csrf_exempt
def recordeffort(request):
    session_user=request.session.get('session_user')
    effortform=WorkEffortsForm(request.POST)
    if effortform.is_valid():
        usereffort=effortform.save(commit=False)
        usereffort.user_name=User.objects.get(username=session_user['username'])
        usereffort.save()
        print('form is valid and saved')
        status='Record has been saved sucessfully'
        ind=0

    else:
        print('form is not valid')
        #status='Please check your details entered!!!'
        status=str(effortform.errors)
        ind=1

    return JsonResponse({'Message':status,'IND':ind})

@login_required
def generatereport(request):
    session_user=request.session.get('session_user')
    user_dict= {
     'v_firstname':session_user['first_name'],
     'v_lastname':session_user['last_name'],
     'is_superuser':session_user['is_superuser'],
     }
    return render(request,'tracker_app/report.html',user_dict)

def reporttemplate(request):
    session_user=request.session.get('session_user')
    context_dict= {
     'v_firstname':session_user['first_name'],
     'v_lastname':session_user['last_name'],
     }

    return render(request,'tracker_app/report_template.htm',context_dict)

@csrf_exempt
def reporttemplateinfo(request):
    session_user=request.session.get('session_user')
    from_date=request.POST['fromdate']
    to_date=request.POST['todate']
    print(from_date,to_date)
    if from_date=="" and to_date=="":
        effort_list=WorkEffort.objects.filter(user_name_id=session_user['id'])
    else:
        effort_list=WorkEffort.objects.filter(work_date__gte=from_date,work_date__lte=to_date,user_name_id=session_user['id'])


    for colitems in ["work_date"]:
        dates =list(effort_list.order_by('work_date').values(colitems))
        print(dates)
        #Creating row span for Date
        eff={}
        i=0
        rowspan=1
        for items in dates:

            if i== len(dates)-1 :
                eff[str(dates[i][colitems])]=rowspan
            else:
                if dates[i][colitems]==dates[i+1][colitems]:
                    rowspan+=1
                else:
                    eff[str(dates[i][colitems])]=rowspan
                    rowspan=1
                i+=1




    return JsonResponse([eff,list(effort_list.values())],safe=False)

@csrf_exempt
def deleteeffort(request):
    userEffortDelete=WorkEffort.objects.get(id=request.POST['delete_id'])
    if userEffortDelete.delete():
        return HttpResponse("Record deleted successfully")
    else:
        return HttpResponse("Error deleting record")

def userrecord(request):
    user_logged=User.objects.values()
    return JsonResponse(list(user_logged),safe=False)

@login_required
def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)  # Important!
            messages.success(request, 'Your password was successfully updated!')
            return redirect('change_password')
        else:
            messages.error(request, 'Please correct the error below.')
    else:
        form = PasswordChangeForm(request.user)
    return render(request, 'tracker_app/change_password.html', {
        'form': form
    })
