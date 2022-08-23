from ast import Delete
from http.client import HTTPResponse
from django.shortcuts import render
from django.http import HttpResponse
# from .models import User
# Create your views here.

from . import models

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.auth import AuthToken, TokenAuthentication

# user is an instance of MyUser
def serialize_user(user):
    return {
        "email" : user.email,
        "username": user.username,
        "password": user.password
        #...
    }

@api_view(['POST'])
def login(request):
    # print(request.data)
    serializer = AuthTokenSerializer(data=request.data) #serialize the parsed content of the request body
    # print(serializer)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data['user']
    _,token = AuthToken.objects.create(user)

    return Response({
        'user_data': serialize_user(user),
        'token': token
    })

@api_view(['GET'])
def get_user(request):
    user = request.user
    print(user)
    if user.is_authenticated:   #has the user logged in?
        return Response({       #if so send data
            'user_data': serialize_user(user)
        })
    return Response({})         #else return "nothing"

