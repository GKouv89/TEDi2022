from rest_framework import serializers
from .models import MyUser, Address

class MyUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MyUser
        fields = ['username', 'isPending']

class OneUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MyUser
        fields = ['username', 'email', 'first_name', 'last_name', 'phone_number', 'tin', 'seller_rating', 'buyer_rating', 'isPending']