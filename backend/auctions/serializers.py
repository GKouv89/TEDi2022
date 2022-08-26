from ast import Add
from rest_framework import serializers, validators
from .models import Item, Bid
from base.models import Address, MyUser
# from base.serializers import AddressSerializer

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['address_name', 'City', 'Country']

class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['username', 'seller_rating']

class BidderSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = ['username', 'buyer_rating']

class BidSerializer(serializers.ModelSerializer):
    fmt = '%d-%m-%Y %H:%M:%S'
    time = serializers.DateTimeField(format=fmt)
    bidder = BidderSerializer()
    class Meta:
        model = Bid
        fields = ['bidder', 'time', 'amount']

class ItemSerializer(serializers.ModelSerializer):
    fmt = '%d-%m-%Y %H:%M:%S'
    started = serializers.DateTimeField(format=fmt)
    ended = serializers.DateTimeField(format=fmt)
    seller = SellerSerializer()
    bids = BidSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'name', 'currently', 'first_bid', 'buy_price', 'number_of_bids', 'started', 'ended', 'description', 'seller', 'bids']
        # fields = ['bids']
        depth = 2