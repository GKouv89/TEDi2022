from ast import Delete
from http.client import HTTPResponse
from django.shortcuts import render
from django.http import HttpResponse
from django.http import HttpResponse, Http404
from .models import MyUser, Address
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView
from .serializers import MyUserSerializer, OneUserSerializer, UserWithAddressSerializer, RegisterSerializer, serialize_user
from . import serializers
from . import models
from rest_framework.decorators import api_view
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from knox.auth import AuthToken, TokenAuthentication


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

@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    
    if serializer.is_valid(raise_exception=True):
        user = serializer.save()    #save to database
        _, token = AuthToken.objects.create(user)
        
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

class ListUsers(ListAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsAdminUser)
    # Authentication remaining here.
    # Check for whether user is admin, too.
    queryset = MyUser.objects.all().order_by('username').exclude(is_staff=True) # Won't return admin's information
    serializer_class = MyUserSerializer

class UserDetail(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsAdminUser)
    # Authentication remaining here.
    # Check for whether user making request is admin, too.
    def get_object(self, username):
        try:
            return MyUser.objects.get(username=username)
        except MyUser.DoesNotExist:
            raise Http404

    def get(self, request, username):
        user = self.get_object(username)
        serializer = OneUserSerializer(user)
        return Response(serializer.data)

    def patch(self, request, username):
        user = self.get_object(username)
        serializer = OneUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserWithAddress(APIView):
    def post(self, request):
        serializer = UserWithAddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

