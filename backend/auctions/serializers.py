from ast import Add
from rest_framework import serializers, validators
from .models import Item, Bid
from base.models import Address, MyUser
from base.serializers import AddressSerializer, MyUserSerializer
from django.utils.timezone import make_aware

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

    ACQUIRED = 'AC'
    RUNNING = 'RU'
    INACTIVE = 'IN'
    STATUS_CHOICES = [
        (INACTIVE, 'Inactive'),
        (RUNNING, 'Running'),
        (ACQUIRED, 'Acquired'),
    ]

    fmt = '%d-%m-%Y %H:%M:%S'
    started = serializers.DateTimeField(format=fmt)
    ended = serializers.DateTimeField(format=fmt)
    seller = SellerSerializer()
    items_bids = BidSerializer(many=True, required=False, read_only=True)
    address = ItemLocationSerializer()
    status = serializers.ChoiceField(choices=Item.STATUS_CHOICES)
    class Meta:
        model = Item
        fields = ['id', 'name', 'currently', 'first_bid', 'buy_price', 'number_of_bids', 'status', 'started', 'ended', 'description', 'seller', 'items_bids', 'address']
        depth = 3

class ItemCreationSerializer(serializers.ModelSerializer):
    address = AddressSerializer()
    fmt = '%d-%m-%Y %H:%M:%S'
    started = serializers.DateTimeField(input_formats=[fmt])
    ended = serializers.DateTimeField(input_formats=[fmt])

    class Meta:
        model = Item
        fields = ['id', 'name', 'first_bid', 'buy_price', 'started', 'ended', 'description', 'seller', 'address']

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
            seller = validated_data["seller"],
            description = validated_data["description"],
            started = validated_data["started"],
            ended = validated_data["started"]
        )
        return item
