from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .permissions import IsOwnerOrReadOnly


from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from rest_framework.exceptions import PermissionDenied

from django.shortcuts import get_object_or_404



from .models import Poll, Choice, Vote
from .serializers import PollSerializer, ChoiceSerializer, VoteSerializer


class PollListCreateView(generics.ListCreateAPIView):
    queryset = Poll.objects.all()
    serializer_class = PollSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class PollDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Poll.objects.all()
    serializer_class = PollSerializer
    permission_classes = [IsOwnerOrReadOnly]  # Use our custom permission here


class ChoiceListCreateView(generics.ListCreateAPIView):
    serializer_class = ChoiceSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        poll_id = self.kwargs['poll_id']
        return Choice.objects.filter(poll_id=poll_id)

    def perform_create(self, serializer):
        poll_id = self.kwargs['poll_id']
        try:
            poll = Poll.objects.get(pk=poll_id)
        except Poll.DoesNotExist:
            raise NotFound("Poll not found")

        if self.request.user != poll.created_by and not self.request.user.is_superuser:
            raise PermissionDenied("You are not allowed to add choices to this poll.")
        serializer.save(poll=poll)


class ChoiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def get_object(self):
        obj = super().get_object()
        poll = obj.poll
        self.check_object_permissions(self.request, poll)
        return obj



class VoteCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, poll_id, choice_id):
        user = request.user
        poll = get_object_or_404(Poll, pk=poll_id)
        choice = get_object_or_404(Choice, pk=choice_id, poll=poll)

        if Vote.objects.filter(user=user, choice__poll=poll).exists():
            return Response(
                {"detail": "You have already voted in this poll."},
                status=status.HTTP_400_BAD_REQUEST
            )

        vote = Vote.objects.create(user=user, choice=choice)
        serializer = VoteSerializer(vote, context={'request': request})

        return Response(serializer.data, status=status.HTTP_201_CREATED)
