from django.db import models


class MasterResume(models.Model):
    name = models.CharField(max_length=100)  # e.g., "General Resume", "Data Resume"
    content = models.TextField()  # full resume text
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Application(models.Model):
    STATUS_CHOICES = [
        ("applied", "Applied"),
        ("interviewed", "Interviewed"),
        ("submitted", "Submitted"),
    ]

    company = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    status = models.CharField(
        max_length=100, choices=STATUS_CHOICES, default="applied"
    )
    master_resume = models.ForeignKey(
        MasterResume,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="applications",
    )
    tailored_resume = models.TextField(blank=True)  # editable copy
    date_applied = models.DateTimeField()

    def save(self, *args, **kwargs):
        # If tailored_resume is empty but master_resume exists, initialize it
        if self.master_resume and not self.tailored_resume:
            self.tailored_resume = self.master_resume.content
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.company} - {self.position} ({self.status})"