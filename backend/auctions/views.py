from django.shortcuts import render
from django.http import Http404
from base.models import MyUser

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView
from knox.auth import AuthToken, TokenAuthentication

from .serializers import BidSerializer, ItemSerializer
from .models import Item

# Create your views here.
class ItemView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, )

    def get_object(self, auction_id):
        try:
            return Item.objects.get(id=auction_id)
        except Item.DoesNotExist:
            raise Http404

    def get(self, request, auction_id):
        item = self.get_object(auction_id)
        serializer = ItemSerializer(item)
        return Response(serializer.data)

    
    # def post(self, request):
    #     serializer = ItemSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AllItems(ListAPIView):
    serializer_class = ItemSerializer
    queryset = Item.objects.all().order_by('id')

class SellersItems(ListAPIView):
    serializer_class = ItemSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, )
    
    def get_queryset(self, username):
        user = MyUser.objects.get(username=username)
        return user.sold_items.all()

    def list(self, request, username):
        req_user = request.user # Only the seller can view these items
        if req_user.username == username:
            page = self.paginate_queryset(self.get_queryset(username))
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)

class ItemsBids(ListAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = BidSerializer
    
    def get_object(self, item_id):
        try:
            return Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            raise Http404
    
    def get_queryset(self, item_id):
        item = self.get_object(item_id)
        return item.items_bids.all()

    def list(self, request, item_id):
        req_user = request.user # Only the seller can view the bids
        item = self.get_object(item_id)
        if(item.seller == req_user):
            page = self.paginate_queryset(self.get_queryset(item_id))
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)
