from django.db import models

# Create your models here.
from cgitb import text
from django.db import models
from base.models import MyUser

# Create your models here.
class Message(models.Model):
    receiver = models.ForeignKey(
        'base.MyUser',
        on_delete = models.CASCADE,
        related_name = 'receiver'
    )
    sender = models.ForeignKey(
        'base.MyUser',
        on_delete = models.CASCADE,
        related_name = 'sender'
    )
    sent_on = models.DateTimeField(null=True)
    text = models.TextField(max_length=5000)
    subject = models.TextField(blank=True, null=True, max_length=30)
    InSent = models.BooleanField(default=1)     #concerns the sender
    InInbox = models.BooleanField(default=1)    #concerns the receiver
    read = models.BooleanField(default=0)