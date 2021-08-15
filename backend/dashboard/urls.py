from dashboard.views import CampaignViewSet, DataSourceViewSet
from django.conf.urls import include
from django.urls import path
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"data-source", DataSourceViewSet)
router.register(r"campaign", CampaignViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
