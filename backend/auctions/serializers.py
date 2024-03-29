from ast import Add
from rest_framework import serializers, validators
# from rest_framework_recursive.fields import RecursiveField
from .models import Category, Item, Bid, Category, ItemImage
from base.models import Address, MyUser
from base.serializers import AddressSerializer, MyUserSerializer
from django.utils.timezone import make_aware
from django.db.models import Q

import datetime

# VIEW ONLY SERIALIZERS
# Trying to return only the necessary data
# according to the prototype 
# Different serializers will be used for creation

class ItemLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['address_name', 'Country']

class BidderLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['City', 'Country']

class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['username', 'seller_rating']

class BuyerSerialzizer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields= ['username']

class BidderSerializer(serializers.ModelSerializer):
    Address = BidderLocationSerializer()
    class Meta:
        model = MyUser
        fields = ['username', 'buyer_rating', 'Address']

class BidSerializer(serializers.ModelSerializer):
    fmt = '%d-%m-%Y %H:%M:%S'
    time = serializers.DateTimeField(format=fmt)
    bidder = BidderSerializer()
    class Meta:
        model = Bid
        fields = ['bidder', 'time', 'amount']
        depth = 2

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']

    def create(self, validated_data):
        if Category.objects.filter(name=validated_data['name']).exists():
            return Category.objects.filter(name=validated_data['name'])
        else:
            return Category.objects.create(name=validated_data['name'])

class ItemImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()

    class Meta:
        model = ItemImage
        fields = ['image', 'id']

class ItemSerializer(serializers.ModelSerializer):
    fmt = '%d-%m-%Y %H:%M:%S'
    started = serializers.DateTimeField(format=fmt)
    ended = serializers.DateTimeField(format=fmt)
    seller = SellerSerializer()
    buyer = BuyerSerialzizer()
    items_bids = BidSerializer(many=True, required=False, read_only=True)
    # address = ItemLocationSerializer() 
    address = AddressSerializer()
    status = serializers.ChoiceField(choices=Item.STATUS_CHOICES)
    category = CategorySerializer(many=True)
    items_images = ItemImageSerializer(many=True, required=False)
    class Meta:
        model = Item
        fields = ['id', 'name', 'category', 'currently', 'first_bid', 'buy_price', 'number_of_bids', 'status', 'started', 'ended', 'description', 'seller', 'buyer', 'items_bids', 'address', 'items_images', 'rating', 'buyer_rating']
        depth = 3

# WRITE ONLY SERIALIZERS

class ItemRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['rating', 'buyer_rating']

class ItemCreationSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    fmt = '%d-%m-%Y %H:%M:%S'
    started = serializers.DateTimeField(input_formats=[fmt])
    ended = serializers.DateTimeField(input_formats=[fmt])
    items_images = ItemImageSerializer(many=True, required=False)

    class Meta:
        model = Item
        fields = ['id', 'name', 'first_bid', 'buy_price', 'started', 'ended', 'description', 'address', 'items_images', 'rating', 'buyer_rating']

    def create(self, validated_data):
        address_data = validated_data.pop('address')
        address = Address.objects.create(**address_data)
        images = {}
        if('items_images' in validated_data.keys()):
            images = validated_data.pop('items_images')    
        item = Item.objects.create(address=address, seller=self.context['request'].user, **validated_data)        
        if len(images) != 0:
            for image_data in images:
                ItemImage.objects.create(item=item, **image_data)
        return item

    def update(self, instance, validated_data):
        address_data = validated_data.pop('address')
        address = instance.address

        address.address_name = address_data['address_name']
        address.Street_name = address_data['Street_name']
        address.Street_number = address_data['Street_number']
        address.Postal_code = address_data['Postal_code']
        address.City = address_data['City']
        address.Country = address_data['Country']
        address.save()
        
        images = {}
        if('items_images' in validated_data.keys()):
            images = validated_data.pop('items_images')

        instance.name = validated_data.get('name', instance.name)
        instance.first_bid = validated_data.get('first_bid', instance.first_bid)
        instance.currently = validated_data.get('first_bid', instance.first_bid)
        instance.buy_price = validated_data.get('buy_price', instance.buy_price)
        instance.started = validated_data.get('started', instance.started)
        instance.ended = validated_data.get('ended', instance.ended)
        instance.description = validated_data.get('description', instance.description)

        if len(images) != 0:
            for image_data in images:
                ItemImage.objects.create(item=instance, **image_data)
        
        instance.save()
        return instance

class BidCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bid
        fields = ['amount']

    def create(self, validated_data):
        time = make_aware(datetime.datetime.now())
        item = Item.objects.get(id=self.context['item'])
        if validated_data["amount"] > item.currently:
            item.currently = validated_data["amount"]
        if item.buy_price is not None and validated_data["amount"] >= item.buy_price:
            item.buyer = self.context['request'].user
            item.status = Item.ACQUIRED
            item.ended = time
            item.notify_buyer = True
            item.notify_seller = True
        item.number_of_bids = item.number_of_bids + 1
        item.save()
        bid = Bid.objects.create(
            bidder = self.context['request'].user,
            time = time,
            item = item,
            amount = validated_data["amount"]
        )
        return bid