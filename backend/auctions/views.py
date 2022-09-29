from django.utils.timezone import make_aware
from django.shortcuts import render
from django.http import Http404
from base.models import MyUser
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.generics import GenericAPIView, ListAPIView, ListCreateAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.parsers import FormParser
from drf_nested_forms.parsers import NestedMultiPartParser
from knox.auth import AuthToken, TokenAuthentication

import datetime

from .serializers import BidCreationSerializer, BidSerializer, CategorySerializer, ItemSerializer, ItemCreationSerializer
from .models import Category, Item, ItemImage

# Create your views here.

def update_auctions_status():
    acquired_items = Item.objects.filter(ended__lt=datetime.datetime.now())
    for item in acquired_items:
        if item.number_of_bids > 0:
            highest_bid = item.items_bids.all().order_by('-amount').first()
            item.buyer = highest_bid.bidder
        item.status = Item.ACQUIRED
        item.save()
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
                if item.number_of_bids > 0:
                    highest_bid = item.items_bids.all().order_by('-amount').first()
                    item.buyer = highest_bid.bidder
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
        # if item.status != Item.INACTIVE or (item.status == Item.RUNNING and item.number_of_bids > 0 ):
        if item.number_of_bids > 0 and item.status != Item.ACQUIRED:
            return Response({"error": "auction should have started"}, status=status.HTTP_412_PRECONDITION_FAILED)
        serializer = ItemCreationSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            print(request.data)
            print(serializer.validated_data)
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, auction_id):
        item = self.get_object(auction_id)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def createXMLFromItem(item, single=True):
    if single:
        atStart ="\t"
        dataStr = "<Item ItemID=\"" + str(item.id) + "\">\n"
    else:
        atStart = "\t\t"
        dataStr = "\t<Item ItemID=\"" + str(item.id) + "\">\n"
    escName = item.name.replace('&', '&amp;')
    dataStr += atStart + "<Name>" + escName + "</Name>\n"
    for category in item.category.all():
        escCategory = category.name.replace('&', '&amp;')
        dataStr += atStart + "<Category>" + escCategory + "</Category>\n"
    dataStr += atStart + "<Currently>$" + str(item.currently) + "</Currently>\n"
    dataStr += atStart + "<First_Bid>$" + str(item.first_bid) + "</First_Bid>\n"
    if item.buy_price is not None:
        dataStr += atStart + "<Buy_Price>$" + str(item.buy_price) + "</Buy_Price>\n"
    dataStr += atStart + "<Number_of_Bids>$" + str(item.number_of_bids) + "</Number_of_Bids>\n"
    if item.items_bids.all().count() != 0:
        dataStr += atStart + "<Bids>\n"
        for bid in item.items_bids.all():
            dataStr += atStart + "\t<Bid>\n"
            dataStr += atStart + "\t\t<Bidder Rating=\"" + str(bid.bidder.buyer_rating) + "\" UserID=\"" + str(bid.bidder.username) + "\">\n"
            if bid.bidder.Address.address_name is not None:
                escLoc = bid.bidder.Address.address_name.replace('&', '&amp;')
                dataStr += atStart + "\t\t\t<Location>" + escLoc + "</Location>\n"
            escCountry = bid.bidder.Address.Country.replace('&', '&amp;')
            dataStr += atStart + "\t\t\t<Country>" + escCountry + "</Country>\n"
            dataStr += atStart + "\t\t</Bidder>\n"
            dataStr += atStart + "\t\t<Time>" + str(bid.time) + "</Time>\n"
            dataStr += atStart + "\t\t<Amount>$" + str(bid.amount) + "</Amount>\n"
            dataStr += atStart + "\t</Bid>\n"
        dataStr += atStart + "</Bids>\n"
    if item.address.address_name is not None:
        escLoc = item.address.address_name.replace('&', '&amp;')
        dataStr += atStart + "<Location>" + escLoc + "</Location>\n"
    escCountry = item.address.Country.replace('&', '&amp;')
    dataStr += atStart + "<Country>" + escCountry + "</Country>\n"
    dataStr += atStart + "<Started>" + str(item.started) + "</Started>\n"
    dataStr += atStart + "<Ends>" + str(item.ended) + "</Ends>\n"
    dataStr += atStart + "<Seller Rating=\"" + str(item.seller.seller_rating) + "\" UserID=\"" + item.seller.username + "\" />\n"
    escDesc = item.description.replace('&', '&amp;')
    dataStr += atStart + "<Description>" + escDesc + "</Description>\n"
    if single:
        dataStr += "</Item>\n"
    else:
        dataStr += "\t</Item>\n"
    return dataStr

class ItemXMLView(RetrieveAPIView):
    authentication_classes = (TokenAuthentication,)
    perimission_classes = (IsAuthenticatedOrReadOnly, IsAdminUser,)

    def get(self, request, item_id):
        item = Item.objects.get(id=item_id)
        response = createXMLFromItem(item)
        return Response(response, status=status.HTTP_200_OK)

class LargeResultsSetPagination(LimitOffsetPagination):
    max_limit = 500

class ItemsXMLView(ListAPIView):
    authentication_classes = (TokenAuthentication,)
    perimission_classes = (IsAuthenticatedOrReadOnly, IsAdminUser,)
    queryset = Item.objects.all().order_by('id')
    pagination_class = LargeResultsSetPagination

    def get(self, request):
        page = self.paginate_queryset(self.get_queryset())
        if page is not None:
            response = "<Items>\n"            
            for item in page:
                print(item.id)
                itemXML = createXMLFromItem(item, single=False)
                response += itemXML
            response += "</Items>"
            return Response(response, status=status.HTTP_200_OK)

class AllItems(ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticatedOrReadOnly, )
    serializer_class = ItemSerializer
    parser_classes = (NestedMultiPartParser, FormParser)

    def get_queryset(self):
        # queryset = Item.objects.filter(status=Item.RUNNING).order_by('id') 
        queryset = Item.objects.all().order_by('id')
        category_list = self.request.query_params.getlist('category', '')
        if category_list is not None:
            q = Q()
            for category in category_list:
                q = q | Q(category__name = category)
            queryset = queryset.filter(q).distinct()
        search_string = self.request.query_params.get('search')
        if search_string is not None:
            print(type(search_string))
            q = Q(name__icontains=search_string) | Q(description__icontains=search_string)
            queryset = queryset.filter(q)    
        price_from = self.request.query_params.get('from')
        price_to = self.request.query_params.get('to')
        if price_from is not None:
            q = Q(currently__gte = price_from)
            queryset = queryset.filter(q)
        if price_to is not None:
            q = Q(currently__lte = price_to)
            queryset = queryset.filter(q)
        return queryset

    def list(self, request): 
        update_auctions_status()
        page = self.paginate_queryset(self.get_queryset())
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
    
    def post(self, request):
        print(request.data)
        serializer = ItemCreationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            item = serializer.save()
            item.currently = item.first_bid
            print(item.currently)
            item.save()
            for name in request.data['categories']:
                category, _ = Category.objects.get_or_create(name=name)
                item.category.add(category)
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ItemsForJSONView(ListAPIView):
    queryset = Item.objects.all().order_by('id')
    pagination_class = LargeResultsSetPagination
    serializer_class = ItemSerializer

class SellersItems(ListAPIView):
    serializer_class = ItemSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, )
    
    def get_queryset(self, username):
        update_auctions_status()
        user = MyUser.objects.get(username=username)
        queryset = user.sold_items.all()
        q = Q(status=Item.INACTIVE) | Q(status=Item.RUNNING)
        queryset = queryset.filter(q).order_by('id')
        return queryset

    def list(self, request, username):
        req_user = request.user # Only the seller can view these items
        if req_user.username == username:
            page = self.paginate_queryset(self.get_queryset(username))
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)

class SoldItems(ListAPIView):
    serializer_class = ItemSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, )
    
    def get_queryset(self, username):
        update_auctions_status()
        user = MyUser.objects.get(username=username)
        queryset = user.sold_items.all()
        q = Q(status=Item.ACQUIRED) & ~Q(buyer=None)
        queryset = queryset.filter(q).order_by('id')
        return queryset

    def list(self, request, username):
        req_user = request.user # Only the seller can view these items
        if req_user.username == username:
            page = self.paginate_queryset(self.get_queryset(username))
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)

class ItemRatingView(UpdateAPIView):
    serializer_class = ItemCreationSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, )
    
    def get_object(self, item_id):
        return Item.objects.get(id=item_id)

    def patch(self, request, username, item_id):
        req_user = request.user
        item = self.get_object(item_id)
        if item.rating == 0 and username == item.buyer.username and req_user == item.buyer:
            serializer = self.get_serializer(item, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                item.seller.seller_rating += request.data['rating']
                item.seller.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)    

class BoughtItems(ListAPIView):
    serializer_class = ItemSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, )
    
    def get_queryset(self, username):
        update_auctions_status()
        user = MyUser.objects.get(username=username)
        queryset = user.bought_items.all().order_by('id')
        return queryset

    def list(self, request, username):
        req_user = request.user # Only the seller can view these items
        if req_user.username == username:
            page = self.paginate_queryset(self.get_queryset(username))
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)

class BuyerRatingView(UpdateAPIView):
    serializer_class = ItemCreationSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, )
    
    def get_object(self, item_id):
        return Item.objects.get(id=item_id)

    def patch(self, request, username, item_id):
        req_user = request.user
        item = self.get_object(item_id)
        if item.buyer_rating == 0 and username == item.seller.username and req_user == item.seller:
            serializer = self.get_serializer(item, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                item.buyer.buyer_rating += request.data['buyer_rating']
                item.buyer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
                if item.number_of_bids > 0:
                    highest_bid = item.items_bids.all().order_by('-amount').first()
                    item.buyer = highest_bid.bidder
                item.save()
            return item

        except Item.DoesNotExist:
            raise Http404
    
    def get_queryset(self, item_id):
        item = self.get_object(item_id)
        return item.items_bids.all().order_by('id')

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
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    pagination_class = None

class VisitorsView(APIView):
    authentication_classes = (TokenAuthentication,)

    def get_object(self, auction_id):
        return Item.objects.get(id=auction_id)

    def post(self, request, auction_id):
        user = request.user
        if user.is_authenticated == True:
            item = self.get_object(auction_id)
            item.visitors.add(user)
            item.save()
        return Response(status=status.HTTP_200_OK)

class RecommendedItems(ListAPIView):
    page_size = 10
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = ItemSerializer

    def get_queryset(self):
        return self.request.user.recommended_items.all().order_by('id')

    def list(self, request):
        page = self.paginate_queryset(self.get_queryset())
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

class ImageView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def delete(self, request, image_id, item_id):
        to_del_item = Item.objects.get(id=item_id)
        to_del = ItemImage.objects.get(id=image_id)
        if to_del_item==to_del.item and request.user == to_del.item.seller:
            to_del.image.delete()
            to_del.delete()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_403_FORBIDDEN)
        



