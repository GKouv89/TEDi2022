import imp
from unittest.util import _MAX_LENGTH
from rest_framework import serializers
from .models import Message
from base.serializers import MyUserMessageSerializer
from base.models import MyUser

class MessageSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format='%d-%m-%Y %H:%M:%S')
    body = serializers.CharField(max_length=5000)
    subject = serializers.CharField(max_length=30, allow_blank=True)
    read = serializers.BooleanField()
    receiver = MyUserMessageSerializer()
    sender = MyUserMessageSerializer()
    
    class Meta:
        model = Message
        fields = ['id', 'receiver', 'sender', 'body', 'subject', 'date', 'read']
        # depth=1

class DeleteMessageSerializer(serializers.ModelSerializer):
    InSent = serializers.BooleanField()
    InInbox = serializers.BooleanField()
    class Meta:
        model = Message
        fields = ['InSent', 'InInbox']

class MyUserSerializer(serializers.ModelSerializer):
  class Meta:
    model = MyUser
    fields = ['username']


class NewMessageSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format='%d-%m-%Y %H:%M:%S')
    body = serializers.CharField(max_length=5000)
    subject = serializers.CharField(max_length=30, allow_blank=True)
    read = serializers.BooleanField(default=False)
    InInbox = serializers.BooleanField(default=True)
    InSent = serializers.BooleanField(default=True)
    receiver = MyUserSerializer()
    sender = MyUserSerializer()

    class Meta:
      model = Message
      fields = ['body', 'sender', 'receiver', 'subject', 'date', 'read', 'InInbox', 'InSent']


