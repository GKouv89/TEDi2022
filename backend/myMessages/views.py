from asyncore import read
from venv import create
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework.generics import GenericAPIView, ListAPIView, CreateAPIView, DestroyAPIView
from knox.auth import AuthToken, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from base.models import MyUser
from .models import Message
from myMessages.serializers import MessageSerializer, DeleteMessageSerializer, NewMessageSerializer
from django.http import Http404
from rest_framework import status

# Create your views here.

class UnreadMessages(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly, )
    
    def get(self, request):
        queryset = Message.objects.filter(receiver=request.user, InInbox=True, read=False)
        if queryset.exists():
            return Response({"unread": True})
        else:
            return Response({"unread": False})

class InboxMessages(ListAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly, )
    serializer_class = MessageSerializer

    def get_queryset(self, request): 
        queryset = Message.objects.filter(receiver=request.user, InInbox=True).order_by('-date')
        return queryset

    def list(self, request):
        page = self.paginate_queryset(self.get_queryset(request))
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            Response({})

class SentMessages(ListAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly, )
    serializer_class = MessageSerializer

    def get_queryset(self, request): 
        queryset = Message.objects.filter(sender=request.user, InSent=True).order_by('-date')
        return queryset

    def list(self, request):
        page = self.paginate_queryset(self.get_queryset(request))
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            Response({})

class InboxMessageView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_queryset(self, mess_id): 
        queryset = Message.objects.get(id=mess_id)
        if not queryset:
            raise Http404
        return queryset

    def get(self, request, mess_id):
        message = self.get_queryset(mess_id)
        serializer = MessageSerializer(message)
        
        object = serializer.data
        user = object.get('receiver').get('id')
        # if user != user_id:
        #     return Response("Message ID does not match this user.", status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data)
    
    def patch(self, request, mess_id):
        Message.objects.filter(id=mess_id).update(read=True)
        return Response({})

class SentMessageView(GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def create(self, request, mess_id):
        print(request.data)
        serializer = NewMessageSerializer(request.data)

        print(serializer)
        data = serializer.data
        print(data)

        receiver_name = data.get('receiver').get('username')
        sender_name = data.get('sender').get('username')

        sender_instance = MyUser.objects.get(username=sender_name)   
        try:   
            receiver_instance = MyUser.objects.get(username=receiver_name)
        except MyUser.DoesNotExist:
            return Response("Receiver does not exist.", status=status.HTTP_400_BAD_REQUEST)

        message = Message.objects.create(sender=sender_instance, receiver=receiver_instance, body=data.get('body'), subject=data.get('subject'), date=data.get('date'))
        return Response({})

    def post(self, request, mess_id):
        return self.create(request, mess_id)

    def get_queryset(self, mess_id): 
        queryset = Message.objects.get(id=mess_id)
        if not queryset:
            raise Http404
        return queryset

    def get(self, request,  mess_id):
        message = self.get_queryset(mess_id)
        serializer = MessageSerializer(message)
        
        object = serializer.data
        user = object.get('sender').get('id')
        if user != user.request:
            return Response("Message ID does not match this user.", status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data)

class DeleteInboxMessage(DestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_queryset(self, mess_id): 
        try:
            queryset = Message.objects.get(id=mess_id)
        except Message.DoesNotExist:
            queryset = {}
        return queryset

    def destroy(self, request, mess_id):
        object = self.get_queryset(mess_id)

        if object == {}:
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = DeleteMessageSerializer(object)

        if serializer.data['InSent'] == False :
            self.perform_destroy(object)
        else:
            Message.objects.filter(id=mess_id).update(InInbox=False)
        return Response({})

    def delete(self, request, mess_id):
        return self.destroy(request, mess_id)

class DeleteSentMessage(DestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_queryset(self, mess_id): 
        try: 
            queryset = Message.objects.get(id=mess_id)
        except Message.DoesNotExist:
            queryset = {}
        return queryset

    def destroy(self, request, mess_id):
        object = self.get_queryset(mess_id)

        if object == {}:
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = DeleteMessageSerializer(object)

        if serializer.data['InInbox'] == False :
            self.perform_destroy(object)
        else:
            Message.objects.filter(id=mess_id).update(InSent=False)

        return Response({})

    def delete(self, request, mess_id):
        return self.destroy(request, mess_id)
