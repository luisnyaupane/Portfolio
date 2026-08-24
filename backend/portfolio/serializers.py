from rest_framework import serializers
from .models import Profile, Skill, Project, Experience, Education, ContactMessage


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            'id', 'name', 'title', 'secondary_title', 'bio', 'short_intro',
            'profile_image', 'email', 'phone', 'github_url', 'linkedin_url',
            'instagram_url', 'location',
        ]


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'icon', 'proficiency', 'order']


class ProjectListSerializer(serializers.ModelSerializer):
    technologies = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'description', 'image', 'technologies',
            'github_url', 'live_url', 'featured', 'created_at',
        ]

    def get_technologies(self, obj):
        return obj.technologies_list()


class ProjectDetailSerializer(ProjectListSerializer):
    class Meta(ProjectListSerializer.Meta):
        pass


class ExperienceSerializer(serializers.ModelSerializer):
    technologies = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = [
            'id', 'company', 'position', 'description', 'start_date',
            'end_date', 'currently_working', 'technologies', 'order',
        ]

    def get_technologies(self, obj):
        return obj.technologies_list()


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = [
            'id', 'institution', 'degree', 'field', 'start_year',
            'end_year', 'description', 'order',
        ]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_message(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Message must be at least 10 characters long.")
        return value

    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Name is required.")
        return value
