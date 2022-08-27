from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path('<int:auction_id>/', views.ItemView.as_view()),
]
