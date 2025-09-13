from django.db import models

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
