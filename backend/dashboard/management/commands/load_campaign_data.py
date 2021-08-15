"""Load campaign data command."""

import csv
from collections import namedtuple
from contextlib import closing
from datetime import datetime

import requests
from dashboard.models import Campaign, DataSource
from django.core.management.base import BaseCommand, CommandError

DataRow = namedtuple(
    "DataRow", ["date", "data_source", "campaign", "clicks", "impressions"]
)


class Command(BaseCommand):
    """Load campaigns data command.
    Usage:
      python manage.py load_campaign_data [csv_url]

    Where "csv_url" is accessible url for csv file.

    File assumes structure of following:
        Date,Datasource,Campaign,Clicks,Impressions
    """

    # Improvements that could be done:
    # Move to some worker, e.g. celery
    help = "Load campaign data from CSV resource."

    def add_arguments(self, parser):
        parser.add_argument("url", nargs="+", type=str)

    def handle(self, *args, **options):
        url = options["url"][0]
        with closing(requests.get(url, stream=True)) as r:
            f = (line.decode("utf-8") for line in r.iter_lines())
            reader = csv.reader(f, delimiter=",", quotechar='"')
            campaigns = []
            skip_first_row = True

            for row in reader:
                # Skip header row
                if skip_first_row:
                    skip_first_row = False
                    continue
                data_item = DataRow(*row)

                data_source, created = DataSource.objects.update_or_create(
                    name=data_item.data_source
                )
                date_time_object = datetime.strptime(data_item.date, "%d.%m.%Y")
                date_formatted = date_time_object.strftime("%Y-%m-%d")
                campaigns.append(
                    Campaign.objects.create(
                        name=data_item.campaign,
                        date=date_formatted,
                        clicks=data_item.clicks or 0,
                        impressions=data_item.impressions or 0,
                        data_source=data_source,
                    )
                )
                if len(campaigns) > 200:
                    Campaign.objects.bulk_update(
                        campaigns,
                        [
                            "name",
                            "date",
                            "clicks",
                            "impressions",
                            "data_source",
                        ],
                    )
                    campaigns = []
