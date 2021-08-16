"""Test load campaign data command."""
from django.test import TestCase
from django.core.management import call_command
from io import StringIO, BytesIO
from dashboard.models import Campaign, DataSource
import responses

mock_csv = StringIO("""Date,Datasource,Campaign,Clicks,Impressions
01.01.2019,Facebook Ads,Like Ads,274,1979
01.01.2019,Facebook Ads,Offer Campaigns - Conversions,10245,764627
01.01.2019,Google Adwords,B2B - Leads,7,444
01.01.2019,Google Adwords,GDN Prospecting - App - Prio 1 Offer,16,12535
01.01.2019,Google Adwords,GDN Prospecting - App - Prio 2 Offer,93,18866
01.01.2019,Google Adwords,GDN Prospecting - Desktop - India Offer,72,59558
01.01.2019,Google Adwords,GDN Prospecting - Desktop - Prio 1 Offer,65,34592
01.01.2019,Google Adwords,GDN Prospecting - Desktop - Prio 3 Offer,87,
""")
mock_csv_b = BytesIO(mock_csv.read().encode('utf8')).read()

class LoadCampaignDataTestCase(TestCase):
    """Load campaign data test case."""

    @responses.activate
    def test_command(self):
        """Ensure command executes with no error and creates expected entities.
        """
        campaigns = Campaign.objects.all()
        dataSources = DataSource.objects.all()
        responses.add(
            responses.GET,
            "http://sample_url.org/test.csv",
            body=mock_csv_b,
            status=200,
            content_type="text/csv",
            stream=True,
        )

        self.assertEqual(campaigns.count(), 0)
        self.assertEqual(dataSources.count(), 0)

        call_command('load_campaign_data', 'http://sample_url.org/test.csv')

        self.assertEqual(campaigns.count(), 8)
        self.assertEqual(dataSources.count(), 2)

    # TODO more test cases could be added:
    # - check if no more than 200 are saved in one batch,
    # - test for errors related to csv invalid data
