from rest_framework import serializers, validators
from .models import MyUser, Address

# user is an instance of MyUser
#simple serializer for login & register
def serialize_user(user):
    return {
        "username": user.username,
        "is_staff": user.is_staff,
        "isPending": user.isPending
    }

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

class RegisterSerializer(serializers.ModelSerializer):
    Address = AddressSerializer()
    class Meta:
        model = MyUser
        fields = ["username", "password", "email", "first_name", "last_name", "phone_number", "tin", "Address"]
        extra_kwargs = {
            "password": {"write_only": True},
            "username": {
                "validators": [
                    validators.UniqueValidator(
                        MyUser.objects.all(), f"A user with that username already exists."
                    )
                ],
            }
        }

    def create(self, validated_data):
        #search if this address already exists in the database
        #if there is nowhere to be found create a new one
        
        addr_data = validated_data.pop("Address")
        addr = Address.objects.create(**addr_data)

        user = MyUser.objects.create_user(
            username = validated_data["username"],
            email = validated_data["email"],
            password = validated_data["password"],
            first_name = validated_data["first_name"],
            last_name = validated_data["last_name"],
            phone_number = validated_data["phone_number"],
            tin = validated_data["tin"],
            Address=addr
        )
        return user


class MyUserSerializer(serializers.HyperlinkedModelSerializer):
    Address = AddressSerializer()

    class Meta:
        model = MyUser
        fields = ['username', 'email', 'first_name', 'last_name', 'phone_number', 'tin', 'isPending', 'Address']

