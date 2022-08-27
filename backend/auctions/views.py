from django.shortcuts import render
from django.http import Http404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from knox.auth import AuthToken, TokenAuthentication

from .serializers import ItemSerializer
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
        # req_user = request.user
        item = self.get_object(auction_id)
        # if(item.seller == req_user):
            serializer = ItemSerializer(item)
            return Response(serializer.data)
        # return Response(status=status.HTTP_403_FORBIDDEN)

    
    # def post(self, request):
    #     serializer = ItemSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
