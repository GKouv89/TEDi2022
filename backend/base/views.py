from http.client import HTTPResponse
from django.shortcuts import render
from django.http import HttpResponse, Http404
from .models import MyUser, Address

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView

from .serializers import MyUserSerializer, OneUserSerializer
from . import serializers
# Create your views here.

# def user(request):
#     user = User.objects.get.first()
#     return HttpResponse('This is user %s.' %user.username)

class ListUsers(ListAPIView):
    # Authentication remaining here.
    # Check for whether user is admin, too.
    pagination_class = PageNumberPagination
    queryset = MyUser.objects.all()
    serializer_class = MyUserSerializer

class UserDetail(APIView):
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

