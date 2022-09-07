from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from base import views
from auctions import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('base.urls')), #ISWS ALLAKSW TA URLS!!
    path('auctions/', include('auctions.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)