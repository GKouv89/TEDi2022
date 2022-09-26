from django.urls import path
from . import views

urlpatterns = [
    path('inbox/unreadmessages/', views.UnreadMessages.as_view()),
    path('inbox/', views.InboxMessages.as_view()),
    path('sent/', views.SentMessages.as_view()),
    path('inbox/<int:mess_id>/', views.InboxMessageView.as_view()),
    path('sent/<int:mess_id>/', views.SentMessageView.as_view()),
    path('inbox/<int:mess_id>/delete/', views.DeleteInboxMessage.as_view()),
    path('sent/<int:mess_id>/delete/', views.DeleteSentMessage.as_view()),
]