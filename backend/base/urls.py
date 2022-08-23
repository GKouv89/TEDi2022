from django.urls import path
from knox import views as knox_views
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path('login/', views.login),
    path('user/', views.get_user),
    path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('users/new/', views.UserWithAddress.as_view()), # this is only temporary, to test the creation of the user
    path('users/', views.ListUsers.as_view()),
    path('users/<str:username>/', views.UserDetail.as_view())
]
