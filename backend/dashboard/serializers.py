from dashboard.models import Campaign, DataSource
from rest_framework import serializers


class DataSourceSerializer(serializers.ModelSerializer):
    """Data source serializer."""

    class Meta:
        model = DataSource
        fields = ["id", "name"]


class CampaignSerializer(serializers.ModelSerializer):
    """Campaign serializer."""

    data_source = DataSourceSerializer(read_only=True)

    class Meta:
        model = Campaign
        fields = ["id", "name", "date", "clicks", "impressions", "data_source"]


class FlatCampaignSerializer(serializers.ModelSerializer):
    """Campaign flat serializer.

    For listing which requires only id and name.
    """

    class Meta:
        model = Campaign
        fields = ["id", "name"]
