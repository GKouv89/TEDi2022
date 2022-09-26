from curses.panel import update_panels
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import matrixFactAPI

class FactorizeView(APIView):
    def post(self, request):
        matrixFactAPI.update_recommendations()
        return Response(status=status.HTTP_200_OK)
