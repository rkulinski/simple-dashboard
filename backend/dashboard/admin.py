from dashboard.models import Campaign, DataSource
from django.contrib import admin


class DataSourceAdmin(admin.ModelAdmin):
    pass


class CampaignAdmin(admin.ModelAdmin):
    pass


admin.site.register(DataSource, DataSourceAdmin)
admin.site.register(Campaign, CampaignAdmin)
