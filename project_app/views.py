from django.shortcuts import render,redirect

#for login,register
from django.contrib.auth.models import User
from django.contrib import auth

from .models import Game
# Create your views here.

def main(request):
    if request.user.is_authenticated:
        asdf= True
        username = request.user.username
    else:
        asdf=False
        username=""
    return render(request,'main.html',{'asdf' :asdf,'username':username,'score':Game.objects.all().order_by('-score')[:15]})
def login(request):
    if request.method=='POST':
        username = request.POST['id']
        password = request.POST['password']
        user = auth.authenticate(request,username = username,password= password)
        if user is not None:
            auth.login(request,user)
            return redirect('main')
        else:
            return render(request,'login.html',{'error':'아이디 혹은 비밀번호를 확인해 주세요'})
    return render(request,'login.html')
def register(request):
    if request.method=='POST':
        if request.POST['password'] == request.POST['password_confirm']:
            user = User.objects.create_user( username = request.POST['id'], password = request.POST['password'])
            auth.login(request,user)
            return redirect('main')

    return render(request,'register.html')
def logout(request):
    if request.method == 'POST':
        auth.logout(request)
        redirect('main')
    return render(request,'login.html')

def ending(request):
    if (request.method == "POST") and ('score' in request.POST) and (request.user.is_authenticated):
        game = Game()
        game.username= request.user.username
        game.score = request.POST['score']
        game.save()
        g = Game.objects.all().order_by('-score')[:15].values_list("id", flat=True) #상위15개만 보존
        Game.objects.exclude(pk__in=list(g)).delete() 
        return redirect('main')
    else:
        return render(request,'main.html')