import { useEffect } from 'react';
import Card from '@material-ui/core/Card';
import {
  ControlPanel,
  FiltersType,
} from 'components/ControlPanel/ControlPanel';
import { DataChart } from 'components/DataChart/DataChart';
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
  useEffect(() => {
    const fetchData = async () => {
      const campaigns = await fetchAll(() => fetchCampaigns({}));
      const dataSource = await fetchAll(() => fetchDataSource({}));
      console.log(campaigns, dataSource);
    };

    fetchData();
  }, []);

  const onFiltersApply = (filters: FiltersType) => {};

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
        <DataChart />
      </div>
    </Card>
  );
};
