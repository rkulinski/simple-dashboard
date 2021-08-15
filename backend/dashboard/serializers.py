from dashboard.models import Campaign, DataSource
from rest_framework import serializers


class DataSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataSource
        fields = ["id", "name"]


class CampaignSerializer(serializers.ModelSerializer):
    data_source = DataSourceSerializer(read_only=True)

    class Meta:
        model = Campaign
        fields = ["id", "name", "date", "clicks", "impressions", "data_source"]
