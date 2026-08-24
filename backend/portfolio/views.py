from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from .models import Profile, Skill, Project, Experience, Education, ContactMessage
from .serializers import (
    ProfileSerializer, SkillSerializer, ProjectListSerializer,
    ProjectDetailSerializer, ExperienceSerializer, EducationSerializer,
    ContactMessageSerializer,
)


class ProfileViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    Exposes the single Profile row.
    GET /api/profile/  -> returns the profile object directly (not a list),
    since a portfolio site only ever has one owner.
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    pagination_class = None

    def list(self, request, *args, **kwargs):
        profile = self.get_queryset().first()
        if not profile:
            return Response({"detail": "Profile not configured yet."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    pagination_class = None

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all()
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        featured = self.request.query_params.get('featured')
        if featured is not None:
            featured_bool = featured.lower() in ('true', '1', 'yes')
            qs = qs.filter(featured=featured_bool)
        return qs


class ExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    pagination_class = None


class EducationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    pagination_class = None


class ContactMessageViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Write-only endpoint: the public can only POST a new message."""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
