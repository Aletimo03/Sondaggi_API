from rest_framework import serializers
from .models import Poll, Choice, Vote

class ChoiceSerializer(serializers.ModelSerializer):
    vote_count = serializers.SerializerMethodField()
    vote_percentage = serializers.SerializerMethodField()
    poll = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Choice
        fields = ['id', 'poll', 'text', 'vote_count', 'vote_percentage']
        read_only_fields = ['vote_count', 'vote_percentage']


    def get_vote_count(self, obj):
        return obj.votes.count()  # assumes related_name='votes' on the Vote model


    def get_vote_percentage(self, obj):
       total_votes = Vote.objects.filter(choice__poll=obj.poll).count()
       if total_votes == 0:
          return 0
       return round((obj.votes.count() / total_votes) * 100, 2)


class PollSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)
    created_by = serializers.ReadOnlyField(source='created_by.username')
    user_vote = serializers.SerializerMethodField()

    class Meta:
        model = Poll
        fields = ['id', 'title', 'created_by', 'created_at', 'choices', 'user_vote']

    def get_user_vote(self, obj):
        user = self.context['request'].user
        if not user.is_authenticated:
            return None

        vote = Vote.objects.filter(choice__poll=obj, user=user).select_related('choice').first()
        if vote:
            return {
                "choice_id": vote.choice.id,
                "choice_text": vote.choice.text
            }
        return None


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'choice', 'user']
        read_only_fields = ['user', 'choice']
