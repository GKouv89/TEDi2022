from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from rest_framework.generics import GenericAPIView, ListAPIView, CreateAPIView, DestroyAPIView
from knox.auth import AuthToken, TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Message
from myMessages.serializers import MessageSerializer, DeleteMessageSerializer
from django.http import Http404
from rest_framework import status

# Create your views here.
class InboxMessages(ListAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly, )
    serializer_class = MessageSerializer

    def get_queryset(self, user_id): 
        queryset = Message.objects.filter(receiver=user_id, InInbox=True)
        return queryset

    def list(self, request, user_id):
        page = self.paginate_queryset(self.get_queryset(user_id))
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            Response({})

class SentMessages(ListAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly, )
    serializer_class = MessageSerializer

    def get_queryset(self, user_id): 
        queryset = Message.objects.filter(sender=user_id, InSent=True)
        return queryset

    def list(self, request, user_id):
        page = self.paginate_queryset(self.get_queryset(user_id))
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        else:
            Response({})

class InboxMessageView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_queryset(self, user_id, mess_id): 
        queryset = Message.objects.get(id=mess_id)
        if not queryset:
            raise Http404
        return queryset

    def get(self, request, user_id, mess_id):
        message = self.get_queryset(user_id, mess_id)
        serializer = MessageSerializer(message)
        
        object = serializer.data
        user = object.get('receiver').get('id')
        if user != user_id:
            return Response("Message ID does not match this user.", status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data)

class SentMessageView(GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly, )
    serializer_class = MessageSerializer

    def create(self, request, user_id, mess_id):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def post(self, request, user_id, mess_id):
        return self.create(request, user_id, mess_id)

    def get_queryset(self, user_id, mess_id): 
        queryset = Message.objects.get(id=mess_id)
        if not queryset:
            raise Http404
        return queryset

    def get(self, request, user_id, mess_id):
        message = self.get_queryset(user_id, mess_id)
        serializer = MessageSerializer(message)
        
        object = serializer.data
        user = object.get('sender').get('id')
        if user != user_id:
            return Response("Message ID does not match this user.", status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data)

class DeleteInboxMessage(DestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_queryset(self, user_id, mess_id): 
        try:
            queryset = Message.objects.get(id=mess_id)
        except Message.DoesNotExist:
            queryset = {}
        return queryset

    def destroy(self, request, user_id, mess_id):
        object = self.get_queryset(user_id, mess_id)

        if object == {}:
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = DeleteMessageSerializer(object)

        if serializer.data['InSent'] == False :
            self.perform_destroy(object)
        else:
            Message.objects.update(InInbox=False)
        return Response({})

    def delete(self, request, user_id, mess_id):
        return self.destroy(request, user_id, mess_id)

class DeleteSentMessage(DestroyAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_queryset(self, user_id, mess_id): 
        try: 
            queryset = Message.objects.get(id=mess_id)
        except Message.DoesNotExist:
            queryset = {}
        return queryset

    def destroy(self, request, user_id, mess_id):
        object = self.get_queryset(user_id, mess_id)

        if object == {}:
            return Response(status=status.HTTP_204_NO_CONTENT)

        serializer = DeleteMessageSerializer(object)

        if serializer.data['InInbox'] == False :
            self.perform_destroy(object)
        else:
            Message.objects.update(InSent=False)
        return Response({})

    def delete(self, request, user_id, mess_id):
        return self.destroy(request, user_id, mess_id)
