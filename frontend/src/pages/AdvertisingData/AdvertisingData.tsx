import { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import {
  ControlPanel,
  FiltersType,
  SelectOption,
} from 'components/ControlPanel/ControlPanel';
import { DataChart, DataChartItem } from 'components/DataChart/DataChart';
import { BasePaginationFilters, fetcher } from 'fetcher';
import { CampaignItemAPI, DataSourceItemAPI } from 'types/dashboardApi';
import styles from './styles.module.scss';

const CAMPAIGNS_API_URL = 'dashboard/campaign';
const DATASOURCE_API_URL = 'dashboard/data-source';

interface DataFilter extends BasePaginationFilters {
  campaign_ids?: string;
  data_sources_ids?: string;
}

export const AdvertisingData = () => {
  const [chartData, setChartData] = useState<DataChartItem[]>([]);
  const [campaignDataOptions, setCampaignDataOptions] = useState<
    SelectOption[]
  >([]);
  const [dataSourcesOptions, setDataSourcesOptions] = useState<SelectOption[]>(
    []
  );
  const [campaignSearchTerm, setCampaignSearchTerm] = useState('');
  const [campaignFilters, setCampaignFilters] = useState<DataFilter>({});
  const [chardDataLoading, setChartDataLoading] = useState(false);

  useEffect(() => {
    // That and below effect are quite similar, so it'd be possible to share some logic.
    const Limit = 100;
    const fetchData = async () => {
      let currentPage = 0;
      let dataSource = await fetchDataSource({
        offset: currentPage,
        limit: Limit,
      });
      let dataSourceData: SelectOption[] = [];
      do {
        dataSourceData = [
          ...dataSourceData,
          ...dataSource.results.map(convertDataSourceToSelect),
        ];
        currentPage += 1;
        dataSource = await fetchDataSource({ offset: currentPage * Limit });
      } while (dataSource.next);
      setDataSourcesOptions(dataSourceData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filteredFetchCampaigns = (pagination: BasePaginationFilters) =>
      fetchCampaigns({
        ...pagination,
        ...campaignFilters,
      });

    const fetchData = async () => {
      setChartDataLoading(true);
      const Limit = 1000;
      let campaignsAggregated = {};
      let currentPage = 0;
      let campaignsResult = await filteredFetchCampaigns({
        offset: currentPage * Limit,
        limit: Limit,
      });
      do {
        campaignsAggregated = aggregateCampaignItems(
          campaignsResult.results,
          campaignsAggregated
        );
        setChartData(
          convertCampaignItemsToChartData(campaignsAggregated).sort((a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          })
        );
        currentPage += 1;
        campaignsResult = await filteredFetchCampaigns({
          offset: currentPage * Limit,
          limit: Limit,
        });
      } while (campaignsResult.next);
      setChartDataLoading(false);
    };

    fetchData();
  }, [campaignFilters]);

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
    const { dataSources = [], campaigns = [] } = filters;

    setCampaignFilters({
      data_sources_ids: dataSources.join(','),
      campaign_ids: campaigns.join(','),
    });
  };

  return (
    <Card className={styles.AdvertisingData_container}>
      <div className={styles.AdvertisingData_panel}>
        <ControlPanel
          onFiltersApply={onFiltersApply}
          campaigns={campaignDataOptions}
          dataSourcesOptions={dataSourcesOptions}
          onCampaignSearch={setCampaignSearchTerm}
          // TODO improvement is to cancel current fetching
          disableApply={chardDataLoading}
        />
      </div>
      <div className={styles.AdvertisingData_chart}>
        {chardDataLoading && <div>Data is still loading...</div>}
        <DataChart data={chartData} />
      </div>
    </Card>
  );
};

type CampaignAggregated = Record<
  string,
  Pick<CampaignItemAPI, 'impressions' | 'clicks' | 'date'>
>;

// Depending on usage those functions could get their own file.

/** Get campaign items in aggregated form.
 * Aggregate by date.
 */
export function aggregateCampaignItems(
  items: CampaignItemAPI[],
  initialValue: CampaignAggregated
): CampaignAggregated {
  return items.reduce<CampaignAggregated>((accumulator, item) => {
    const dateRecord = accumulator[item.date];
    if (dateRecord === undefined) {
      accumulator[item.date] = {
        impressions: item.impressions || 0,
        clicks: item.clicks || 0,
        date: item.date,
      };
    } else {
      accumulator[item.date] = {
        impressions: dateRecord.impressions + item.impressions,
        clicks: dateRecord.clicks + item.clicks,
        date: item.date,
      };
    }

    return accumulator;
  }, initialValue);
}

function convertCampaignItemsToChartData(aggregated: CampaignAggregated) {
  return Object.entries(aggregated).map((entry) => {
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

/** Get campaign items with name and id only.
 */
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
