from ast import Add
from rest_framework import serializers, validators
from .models import Item, Bid
from base.models import Address, MyUser
# from base.serializers import AddressSerializer

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

class ItemSerializer(serializers.ModelSerializer):
    fmt = '%d-%m-%Y %H:%M:%S'
    started = serializers.DateTimeField(format=fmt)
    ended = serializers.DateTimeField(format=fmt)
    seller = SellerSerializer()
    items_bids = BidSerializer(many=True, required=False, read_only=True)
    address = ItemLocationSerializer()

    class Meta:
        model = Item
        fields = ['id', 'name', 'currently', 'first_bid', 'buy_price', 'number_of_bids', 'started', 'ended', 'description', 'seller', 'items_bids', 'address']
        depth = 3
