from unittest.util import _MAX_LENGTH
from rest_framework import serializers
from .models import Message
from base.serializers import MyUserMessageSerializer

class MessageSerializer(serializers.ModelSerializer):
    sent_on = serializers.DateTimeField(format='%d-%m-%Y %H:%M:%S')
    text = serializers.CharField(max_length=5000)
    subject = serializers.CharField(max_length=30, allow_blank=True)
    read = serializers.BooleanField()
    receiver = MyUserMessageSerializer()
    sender = MyUserMessageSerializer()
    
    class Meta:
        model = Message
        fields = ['receiver', 'sender', 'text', 'subject', 'sent_on', 'read']

class DeleteMessageSerializer(serializers.ModelSerializer):
    InSent = serializers.BooleanField()
    InInbox = serializers.BooleanField()
    class Meta:
        model = Message
        fields = ['InSent', 'InInbox']
