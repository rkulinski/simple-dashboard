import { useEffect, useMemo, useState } from 'react';
import Card from '@material-ui/core/Card';
import {
  ControlPanel,
  FiltersType,
} from 'components/ControlPanel/ControlPanel';
import { DataChart, DataChartItem } from 'components/DataChart/DataChart';
import { BasePaginationFilters, fetchAll, fetcher } from 'fetcher';
import { CampaignItemAPI, DataSourceItemAPI } from 'types/dashboardApi';
import styles from './styles.module.scss';

const CAMPAIGNS_API_URL = 'dashboard/campaign';
const DATASOURCE_API_URL = 'dashboard/data-source';

interface DataFilter extends BasePaginationFilters {
  name?: string;
}

function fetchCampaigns(queryParams: DataFilter) {
  return fetcher<CampaignItemAPI, DataFilter>({
    endpoint: CAMPAIGNS_API_URL,
    queryParams,
  });
}

function fetchDataSource(queryParams: DataFilter) {
  return fetcher<DataSourceItemAPI, DataFilter>({
    endpoint: DATASOURCE_API_URL,
    queryParams,
  });
}

export const AdvertisingData = () => {
  const [campaignData, setCampaignData] = useState<CampaignItemAPI[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const campaigns = await fetchAll(fetchCampaigns, 1000);
      const dataSource = await fetchAll(fetchDataSource);
      setCampaignData(campaigns.items);
    };

    fetchData();
  }, []);

  const onFiltersApply = (filters: FiltersType) => {};

  const chartData = useMemo(() => {
    return convertDataSourceToChartData(campaignData);
  }, [campaignData]);

  return (
    <Card className={styles.AdvertisingData_container}>
      <div className={styles.AdvertisingData_panel}>
        <ControlPanel
          onFiltersApply={onFiltersApply}
          campaigns={[]}
          dataSourcesOptions={[]}
        />
      </div>
      <div className={styles.AdvertisingData_chart}>
        <DataChart data={chartData} />
      </div>
    </Card>
  );
};

function convertDataSourceToChartData(
  items: CampaignItemAPI[],
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
