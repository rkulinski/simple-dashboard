import {
  ControlPanel,
  FiltersType,
} from 'components/ControlPanel/ControlPanel';
import { DataChart } from 'components/DataChart/DataChart';
import styles from './styles.module.scss';

export const AdvertisingData = () => {
  const onFiltersApply = (filters: FiltersType) => {
    console.log(filters);
  };

  return (
    <div className={styles.AdvertisingData_container}>
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
    </div>
  );
};
