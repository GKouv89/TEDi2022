from posixpath import supports_unicode_filenames
from pyexpat import model
from types import CoroutineType
from unicodedata import name
from django.contrib.gis.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Create your models here.

class MyUserManager(BaseUserManager):
    def create_user(self, username,  email, password, first_name=None, last_name=None, phone_number=None,  tin=None, Address=None):
        if not email:
            raise ValueError("email is required")
        if not username:
            raise ValueError("username is required")
        if not password:
            raise ValueError("password is required")

        user = self.model(
            email=self.normalize_email(email),   #normalize -> format the email
            username = username,
            # password=password,
            first_name = first_name,
            last_name = last_name,
            phone_number = phone_number,
            tin = tin,
            Address = Address
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None):
            user = self.create_user(
                email=email,
                username=username,
                password=password
            )
            user.is_admin=True
            user.is_staff = True
            user.is_superuser=True
            user.save(using=self._db)
            return user

class MyUser(AbstractBaseUser):
    username = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50, null=True)
    last_name = models.CharField(max_length=50, null=True)
    password = models.CharField(max_length=255)
    email = models.EmailField(max_length=60)
    phone_number = models.CharField(max_length=20, null=True)
    seller_rating = models.PositiveIntegerField(default=0)
    buyer_rating = models.PositiveIntegerField(default=0)
    tin = models.CharField(max_length=20, null=True)
    isPending = models.BooleanField(default=True)

    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    Address = models.ForeignKey(
        'Address',
        on_delete=models.CASCADE,  null=True
    )

    USERNAME_FIELD = "username"

    REQUIRED_FIELDS = ['email', 'password']

    objects = MyUserManager()

    def has_perm(self, perm, obj=None):
        return True 

    def has_module_perms(self, app_label):
        return True

class Address(models.Model):
    location = models.PointField(primary_key=True)
    address_name = models.CharField(max_length=50)
    Street_name = models.CharField(max_length=50)
    Street_number = models.PositiveIntegerField()
    Postal_code = models.CharField(max_length=50)
    City =  models.CharField(max_length=50)
    Country = models.CharField(max_length=50)