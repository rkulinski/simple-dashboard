"""Admin classes for dashboard app."""

from dashboard.models import Campaign, DataSource
from django.contrib import admin


class DataSourceAdmin(admin.ModelAdmin):
    """Data Source Admin class."""

    pass


class CampaignAdmin(admin.ModelAdmin):
    """Campaign Admin class."""

    pass


admin.site.register(DataSource, DataSourceAdmin)
admin.site.register(Campaign, CampaignAdmin)
