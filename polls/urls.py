from django.urls import path
from .views import PollListCreateView, PollDetailView
from .views import ChoiceListCreateView, ChoiceDetailView
from .views import VoteCreateView


urlpatterns = [
    path('polls/', PollListCreateView.as_view(), name='polls-list'),
    path('polls/<int:pk>/', PollDetailView.as_view(), name='poll-detail'),

    path('polls/<int:poll_id>/choices/', ChoiceListCreateView.as_view(), name='choice-list-create'),
    path('polls/<int:poll_id>/choices/<int:pk>/', ChoiceDetailView.as_view(), name='choice-detail'),


    path('polls/<int:poll_id>/choices/<int:choice_id>/vote/', VoteCreateView.as_view(), name='vote-create'),

]
