from rest_framework import serializers
from .models import MyUser, Address

class OneUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MyUser
        fields = ['username', 'email', 'first_name', 'last_name', 'phone_number', 'tin', 'seller_rating', 'buyer_rating', 'isPending']

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['Street_name', 'Street_number', 'Postal_code', 'City', 'Country']

class UserWithAddressSerializer(serializers.ModelSerializer):
    Address = AddressSerializer()
    class Meta:
        model = MyUser
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'phone_number', 'tin', 'seller_rating', 'buyer_rating', 'isPending', 'Address']

    def create(self, validated_data):
        addr_data = validated_data.pop('Address')
        addr = Address.objects.create(**addr_data)
        user = MyUser.objects.create_user(**validated_data, Address=addr)
        return user

class MyUserSerializer(serializers.HyperlinkedModelSerializer):
    Address = AddressSerializer()

    class Meta:
        model = MyUser
        fields = ['username', 'email', 'first_name', 'last_name', 'phone_number', 'tin', 'isPending', 'Address']
