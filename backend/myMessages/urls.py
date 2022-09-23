from django.urls import path
from . import views

urlpatterns = [
    path('<int:user_id>/inbox/', views.InboxMessages.as_view()),
    path('<int:user_id>/sent/', views.SentMessages.as_view()),
    path('<int:user_id>/inbox/<int:mess_id>/', views.InboxMessageView.as_view()),
    path('<int:user_id>/sent/<int:mess_id>/', views.SentMessageView.as_view()),
    path('<int:user_id>/inbox/<int:mess_id>/delete/', views.DeleteInboxMessage.as_view()),
    path('<int:user_id>/sent/<int:mess_id>/delete/', views.DeleteSentMessage.as_view()),
]