from django.contrib import admin
from .models import Profile, Skill, Project, Experience, Education, ContactMessage


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'email', 'location')


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'proficiency', 'order')
    list_filter = ('category',)
    search_fields = ('name',)
    ordering = ('category', 'order')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'featured', 'created_at')
    list_filter = ('featured',)
    search_fields = ('title', 'description', 'technologies')
    ordering = ('-created_at',)
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('position', 'company', 'start_date', 'end_date', 'currently_working', 'order')
    list_filter = ('currently_working',)
    search_fields = ('company', 'position')
    ordering = ('order', '-start_date')


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ('degree', 'institution', 'start_year', 'end_year', 'order')
    search_fields = ('institution', 'degree')
    ordering = ('order', '-start_year')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    ordering = ('-created_at',)
