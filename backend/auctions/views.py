from django.utils.timezone import make_aware
from django.shortcuts import render
from django.http import Http404
from base.models import MyUser
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.generics import ListAPIView, ListCreateAPIView
from knox.auth import AuthToken, TokenAuthentication

import datetime

from .serializers import BidCreationSerializer, BidSerializer, CategoryHierarchySerializer2, ItemSerializer, ItemCreationSerializer
from .models import Category, Item

# Create your views here.

def update_auctions_status():
    Item.objects.filter(ended__lt=datetime.datetime.now()).update(status=Item.ACQUIRED)
    Item.objects.filter(Q(started__lt=datetime.datetime.now()) & Q(ended__gt=datetime.datetime.now()) & ~Q(status=Item.ACQUIRED)).update(status=Item.RUNNING)


class ItemView(APIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated, )

    def get_object(self, auction_id):
        try:
            item = Item.objects.get(id=auction_id)
            now = make_aware(datetime.datetime.now())
            if item.started < now and item.ended > now and item.status != Item.ACQUIRED:
                item.status = Item.RUNNING
                item.save()
            elif item.ended < now:
                item.status = Item.ACQUIRED
                item.save()
            return item
        except Item.DoesNotExist:
            raise Http404

    def get(self, request, auction_id):
        item = self.get_object(auction_id)
        serializer = ItemSerializer(item)
        return Response(serializer.data)
    
    def patch(self, request, auction_id):
        item = self.get_object(auction_id)
        if item.status != Item.INACTIVE:
            return Response({"error": "auction should have started"}, status=status.HTTP_412_PRECONDITION_FAILED)
        serializer = ItemCreationSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class AllItems(ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly, )
    serializer_class = ItemSerializer
    queryset = Item.objects.filter(status=Item.RUNNING).order_by('id') # Should probably return all active ones only

    def list(self, request): 
        update_auctions_status()
        page = self.paginate_queryset(self.get_queryset())
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
    
    def post(self, request):
        serializer = ItemCreationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SellersItems(ListAPIView):
    serializer_class = ItemSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, )
    
    def get_queryset(self, username):
        update_auctions_status()
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
            item = Item.objects.get(id=item_id)
            now = make_aware(datetime.datetime.now())
            if item.started < now and item.ended > now:
                item.status = Item.RUNNING
                item.save()
            elif item.ended < now:
                item.status = Item.ACQUIRED
                item.save()
            return item

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

    def post(self, request, item_id):
        item = Item.objects.get(id=item_id)
        if item.status == Item.ACQUIRED:
            return Response({"error": "auction is no longer running"}, status=status.HTTP_412_PRECONDITION_FAILED)
        elif item.status == Item.INACTIVE:
            return Response({"error": "auction hasn't started yet"}, status=status.HTTP_412_PRECONDITION_FAILED)
        serializer = BidCreationSerializer(data=request.data, context={'request': request, 'item': item_id})
        if serializer.is_valid():
            if item.first_bid > request.data["amount"]:
                return Response({"error": "Bid amount too small"}, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class Categories(ListAPIView):
    queryset = Category.objects.filter(parent_category__isnull=True)
    serializer_class = CategoryHierarchySerializer2