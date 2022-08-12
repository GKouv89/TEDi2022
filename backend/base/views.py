from http.client import HTTPResponse
from django.shortcuts import render
from django.http import HttpResponse
from .models import User
# Create your views here.

def user(request):
    user = User.objects.get.first()
    return HttpResponse('This is user %s.' %user.username)
