from rest_framework.routers import DefaultRouter
from .views import (
    ProfileViewSet, SkillViewSet, ProjectViewSet,
    ExperienceViewSet, EducationViewSet, ContactMessageViewSet,
)

router = DefaultRouter()
router.register('profile', ProfileViewSet, basename='profile')
router.register('skills', SkillViewSet, basename='skill')
router.register('projects', ProjectViewSet, basename='project')
router.register('experience', ExperienceViewSet, basename='experience')
router.register('education', EducationViewSet, basename='education')
router.register('contact', ContactMessageViewSet, basename='contact')

urlpatterns = router.urls
