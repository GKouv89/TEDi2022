from ast import Add
from rest_framework import serializers, validators
from rest_framework_recursive.fields import RecursiveField
from .models import Category, Item, Bid, Category
from base.models import Address, MyUser
from base.serializers import AddressSerializer, MyUserSerializer
from django.utils.timezone import make_aware

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

class CategoryHierarchySerializer(serializers.ModelSerializer):
    parent_category = RecursiveField(allow_null=True)
    
    class Meta:
        model = Category
        fields=['name', 'parent_category']

class ItemSerializer(serializers.ModelSerializer):
    fmt = '%d-%m-%Y %H:%M:%S'
    started = serializers.DateTimeField(format=fmt)
    ended = serializers.DateTimeField(format=fmt)
    seller = SellerSerializer()
    items_bids = BidSerializer(many=True, required=False, read_only=True)
    address = ItemLocationSerializer()
    status = serializers.ChoiceField(choices=Item.STATUS_CHOICES)
    category = CategoryHierarchySerializer()
    class Meta:
        model = Item
        fields = ['id', 'name', 'category', 'currently', 'first_bid', 'buy_price', 'number_of_bids', 'status', 'started', 'ended', 'description', 'seller', 'items_bids', 'address']
        depth = 3

class ItemCreationSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    fmt = '%d-%m-%Y %H:%M:%S'
    started = serializers.DateTimeField(input_formats=[fmt])
    ended = serializers.DateTimeField(input_formats=[fmt])
    category = serializers.SlugRelatedField(slug_field='name', queryset=Category.objects.all())
    class Meta:
        model = Item
        fields = ['id', 'name', 'category', 'first_bid', 'buy_price', 'started', 'ended', 'description', 'address']

    def create(self, validated_data):
        address_data = validated_data.pop('address')
        if Address.objects.filter(Street_number=address_data['Street_number'], Street_name=address_data['Street_name'], Postal_code=address_data['Postal_code'], City=address_data['City'], Country=address_data['Country']).exists():
            address = Address.objects.get(Street_number=address_data['Street_number'], Street_name=address_data['Street_name'], Postal_code=address_data['Postal_code'], City=address_data['City'], Country=address_data['Country'])
        else:
            address = Address.objects.create(**address_data)

        item = Item.objects.create(
            name = validated_data["name"],
            first_bid = validated_data["first_bid"],
            buy_price = validated_data["buy_price"],
            address = address,
            category = validated_data["category"],
            seller = self.context['request'].user,
            description = validated_data["description"],
            started = validated_data["started"],
            ended = validated_data["ended"]
        )
        return item

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
            item.status = Item.ACQUIRED
            item.ended = time
        item.number_of_bids = item.number_of_bids + 1
        item.save()
        bid = Bid.objects.create(
            bidder = self.context['request'].user,
            time = time,
            item = item,
            amount = validated_data["amount"]
        )
        return bid