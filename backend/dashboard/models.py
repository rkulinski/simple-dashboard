"""Dashboard app models."""
from django.db import models


class DataSource(models.Model):
    """Datasource model which keeps sources of campaign data."""

    name = models.CharField(
        max_length=255, null=False, blank=False, unique=True, primary_key=True
    )


class Campaign(models.Model):
    """Campaign model."""

    name = models.CharField(max_length=255, null=False, blank=False)
    date = models.DateField(null=True)
    data_source = models.ForeignKey(DataSource, on_delete=models.RESTRICT)
    clicks = models.IntegerField(default=0)
    impressions = models.IntegerField(default=0)
