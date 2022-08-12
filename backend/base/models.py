from django.contrib.gis.db import models

# Create your models here.

class User(models.Model):
    username = models.CharField(primary_key=True, max_length=32)

class Address(models.Model):
    location = models.PointField(primary_key=True)
