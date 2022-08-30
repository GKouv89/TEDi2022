from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path('categories/', views.Categories.as_view()),
    path('', views.AllItems.as_view()),
    path('<int:auction_id>/', views.ItemView.as_view()),
    path('<int:item_id>/bids/', views.ItemsBids.as_view()),
    path('<str:username>/', views.SellersItems.as_view()),
]
