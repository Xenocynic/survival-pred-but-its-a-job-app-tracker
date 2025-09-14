from django.utils import timezone
from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_migrate

# Create your models here.
class Application(models.Model):
    STATUS_CHOICES = [
        ("applied", "Applied"),
        ("interviewed", "Interviewed"),
        ("submitted", "Submitted")
    ]
    company = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, default="applied")
    resume_text = models.TextField(blank=True)
    date_applied = models.DateTimeField()

    def __str__(self):
        return f"{self.company} - {self.position} ({self.status})"
    
@receiver(post_migrate)
def create_default_applications(sender, **kwargs):
    if sender.name == 'mainapp' and not Application.objects.exists():
            Application.objects.create(
                company="Google",
                position="Software Engineer",
                status="applied",
                resume_text="This is a sample resume text.",
                date_applied=timezone.now()
            )
            Application.objects.create(
                company="Microsoft",
                position="Data Scientist",
                status="interviewed",
                resume_text="This is another sample resume text.",
                date_applied=timezone.now()
            )
