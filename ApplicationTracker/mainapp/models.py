from django.db import models

# Create your models here.
class Application(models.Model):
    company_name = models.CharField(max_length=100)
    date_applied = models.DateTimeField()
    