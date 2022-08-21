from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path('users/new/', views.UserWithAddress.as_view()), # this is only temporary, to test the creation of the user
    path('users/', views.ListUsers.as_view()),
    path('users/<str:username>/', views.UserDetail.as_view()),
]

# urlpatterns = format_suffix_patterns(urlpatterns)