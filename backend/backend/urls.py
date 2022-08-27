from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from base import views
from auctions import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('base.urls')), #ISWS ALLAKSW TA URLS!!
    path('auctions/', include('auctions.urls')),
]