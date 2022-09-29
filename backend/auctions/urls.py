from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path('recommended/', views.RecommendedItems.as_view()),
    path('categories/', views.Categories.as_view()),
    path('', views.AllItems.as_view()),
    path('xml/', views.ItemsXMLView.as_view()),
    path('json/', views.ItemsForJSONView.as_view()),
    path('<int:auction_id>/', views.ItemView.as_view()),
    path('<int:item_id>/xml/', views.ItemXMLView.as_view()),
    path('<int:auction_id>/visitors/', views.VisitorsView.as_view()),
    path('<int:item_id>/bids/', views.ItemsBids.as_view()),
    path('<int:item_id>/images/<int:image_id>/', views.ImageView.as_view()),
    path('<str:username>/', views.SellersItems.as_view()),
    path('<str:username>/sold/', views.SoldItems.as_view()),
    path('<str:username>/sold/<int:item_id>/', views.BuyerRatingView.as_view()),
    path('<str:username>/bought/', views.BoughtItems.as_view()),
    path('<str:username>/bought/<int:item_id>/', views.ItemRatingView.as_view()),
]
