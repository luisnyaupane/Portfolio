from django.db import models
from django.utils.text import slugify


class Profile(models.Model):
    """The single site-owner profile. There should only ever be one row."""
    name = models.CharField(max_length=150)
    title = models.CharField(max_length=150, help_text="Primary professional title")
    secondary_title = models.CharField(max_length=150, blank=True)
    bio = models.TextField(help_text="Professional summary")
    short_intro = models.TextField(help_text="Short hero-section introduction", blank=True)
    profile_image = models.ImageField(upload_to='profile/', blank=True, null=True)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    location = models.CharField(max_length=150, blank=True)

    def __str__(self):
        return self.name


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ('frontend', 'Frontend'),
        ('backend', 'Backend'),
        ('database', 'Database'),
        ('tools', 'Tools'),
        ('languages', 'Languages'),
        ('concepts', 'Concepts'),
        ('other', 'Other'),
    ]
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    icon = models.CharField(max_length=100, blank=True, help_text="Icon class/name or short label")
    proficiency = models.PositiveSmallIntegerField(default=80, help_text="0-100")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['category', 'order', 'name']

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"


class Project(models.Model):
    title = models.CharField(max_length=150)
    slug = models.SlugField(max_length=170, unique=True, blank=True)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    technologies = models.CharField(max_length=300, help_text="Comma-separated list of technologies")
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def technologies_list(self):
        return [t.strip() for t in self.technologies.split(',') if t.strip()]

    def __str__(self):
        return self.title


class Experience(models.Model):
    company = models.CharField(max_length=150)
    position = models.CharField(max_length=150)
    description = models.TextField(help_text="Use newlines to separate bullet points")
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    currently_working = models.BooleanField(default=False)
    technologies = models.CharField(max_length=300, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', '-start_date']

    def technologies_list(self):
        return [t.strip() for t in self.technologies.split(',') if t.strip()]

    def __str__(self):
        return f"{self.position} @ {self.company}"


class Education(models.Model):
    institution = models.CharField(max_length=150)
    degree = models.CharField(max_length=150)
    field = models.CharField(max_length=150, blank=True)
    start_year = models.PositiveIntegerField()
    end_year = models.CharField(max_length=20, help_text="Year, or 'Present'")
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', '-start_year']

    def __str__(self):
        return f"{self.degree} — {self.institution}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} <{self.email}> — {self.subject or 'No subject'}"
