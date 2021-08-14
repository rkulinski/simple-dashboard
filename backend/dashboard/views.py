from dashboard.models import Campaign, DataSource
from dashboard.serializers import CampaignSerializer, DataSourceSerializer
from rest_framework import viewsets


class DataSourceViewSet(viewsets.ModelViewSet):
    queryset = DataSource.objects.all()
    serializer_class = DataSourceSerializer


class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
