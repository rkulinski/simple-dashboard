"""Views for Dashboard app."""
from dashboard.filters import CampaignFilterBackend
from dashboard.models import Campaign, DataSource
from dashboard.serializers import (
    CampaignSerializer,
    DataSourceSerializer,
    FlatCampaignSerializer,
)
from rest_framework import viewsets


class DataSourceViewSet(viewsets.ModelViewSet):
    """Data source view set."""

    queryset = DataSource.objects.all()
    serializer_class = DataSourceSerializer


class CampaignViewSet(viewsets.ModelViewSet):
    """Data source view set."""

    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer
    filter_backends = (CampaignFilterBackend,)

    def get_serializer_class(self):
        """Get flat list of name and id when flat query param is provided."""
        if "flat" in self.request.query_params:
            return FlatCampaignSerializer

        return CampaignSerializer
