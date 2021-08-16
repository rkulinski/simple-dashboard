import { useEffect, useMemo, useState } from 'react';
import Card from '@material-ui/core/Card';
import {
  ControlPanel,
  FiltersType,
  SelectOption,
} from 'components/ControlPanel/ControlPanel';
import { DataChart, DataChartItem } from 'components/DataChart/DataChart';
import { BasePaginationFilters, fetchAll, fetcher } from 'fetcher';
import { CampaignItemAPI, DataSourceItemAPI } from 'types/dashboardApi';
import styles from './styles.module.scss';

const CAMPAIGNS_API_URL = 'dashboard/campaign';
const DATASOURCE_API_URL = 'dashboard/data-source';

interface DataFilter extends BasePaginationFilters {
  campaign_ids?: string;
  data_sources_ids?: string;
}

export const AdvertisingData = () => {
  const [campaignData, setCampaignData] = useState<CampaignItemAPI[]>([]);
  const [campaignDataOptions, setCampaignDataOptions] = useState<
    SelectOption[]
  >([]);
  const [dataSourcesOptions, setDataSourcesOptions] = useState<SelectOption[]>(
    []
  );
  const [campaignSearchTerm, setCampaignSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      // TODO because campaigns are big set of data instead of loading that directly into
      // memory it could be already transformed into chart data by chunks.
      const campaigns = await fetchAll(fetchCampaigns, 1000);
      const dataSource = await fetchAll(fetchDataSource);
      setDataSourcesOptions(dataSource.items.map(convertDataSourceToSelect));
      setCampaignData(campaigns.items);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const campaigns = await fetchFlatCampaigns({
        name: campaignSearchTerm,
      });

      setCampaignDataOptions(campaigns.results.map(convertCampaignToSelect));
    };

    fetchCampaigns();
  }, [campaignSearchTerm]);

  const onFiltersApply = async (filters: FiltersType) => {
    const campaigns = await fetchAll((pagination) =>
      fetchCampaigns({
        ...pagination,
        campaign_ids: filters.campaigns.join(','),
        data_sources_ids: filters.dataSources.join(','),
      })
    );
    setCampaignData(campaigns.items);
  };

  const chartData = useMemo(() => {
    return convertCampaignItemsToChartData(campaignData);
  }, [campaignData]);

  return (
    <Card className={styles.AdvertisingData_container}>
      <div className={styles.AdvertisingData_panel}>
        <ControlPanel
          onFiltersApply={onFiltersApply}
          campaigns={campaignDataOptions}
          dataSourcesOptions={dataSourcesOptions}
          onCampaignSearch={setCampaignSearchTerm}
        />
      </div>
      <div className={styles.AdvertisingData_chart}>
        <DataChart data={chartData} />
      </div>
    </Card>
  );
};

function convertCampaignItemsToChartData(
  items: CampaignItemAPI[]
): DataChartItem[] {
  const sum = items.reduce<
    Record<string, Pick<CampaignItemAPI, 'impressions' | 'clicks'>>
  >((accumulator, item) => {
    const dateRecord = accumulator[item.date];
    if (dateRecord === undefined) {
      accumulator[item.date] = {
        impressions: item.impressions || 0,
        clicks: item.clicks || 0,
      };
    } else {
      accumulator[item.date] = {
        impressions: dateRecord.impressions + item.impressions,
        clicks: dateRecord.clicks + item.clicks,
      };
    }

    return accumulator;
  }, {});

  return Object.entries(sum).map((entry) => {
    return {
      name: entry[0],
      ...entry[1],
    };
  });
}

function convertDataSourceToSelect(
  dataSourceItem: DataSourceItemAPI
): SelectOption {
  return {
    label: dataSourceItem.name,
    value: String(dataSourceItem.id),
  };
}

function convertCampaignToSelect(campaignItem: CampaignItemAPI): SelectOption {
  return {
    label: campaignItem.name,
    value: String(campaignItem.id),
  };
}

function fetchCampaigns(queryParams: DataFilter) {
  return fetcher<CampaignItemAPI, DataFilter>({
    endpoint: CAMPAIGNS_API_URL,
    queryParams,
  });
}

function fetchFlatCampaigns(
  queryParams: Pick<DataFilter, 'campaign_ids'> & { name: string }
) {
  // TODO this could be used with some input which would accept lazy loading.
  return fetcher<CampaignItemAPI, DataFilter & { flat: boolean; name: string }>(
    {
      endpoint: CAMPAIGNS_API_URL,
      queryParams: {
        ...queryParams,
        flat: true,
        limit: 20,
      },
    }
  );
}

function fetchDataSource(queryParams: DataFilter) {
  return fetcher<DataSourceItemAPI, DataFilter>({
    endpoint: DATASOURCE_API_URL,
    queryParams,
  });
}
