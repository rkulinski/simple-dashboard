from rest_framework import filters


class CampaignFilterBackend(filters.BaseFilterBackend):
    """Allow to filter by multiple ids."""

    def filter_queryset(self, request, queryset, view):
        campaign_ids = request.query_params.get("campaign_ids") or ""
        data_sources_ids = request.query_params.get("data_sources_ids") or ""

        if len(campaign_ids) and len(data_sources_ids):
            return queryset.filter(
                id__in=campaign_ids.split(","),
                data_source__id__in=data_sources_ids.split(","),
            )
        if len(campaign_ids):
            return queryset.filter(
                id__in=campaign_ids.split(","),
            )
        if len(data_sources_ids):
            print(campaign_ids.split(","))
            return queryset.filter(
                data_source__id__in=data_sources_ids.split(","),
            )

        return queryset
