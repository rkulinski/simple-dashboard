import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import styles from './styles.module.scss';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FiltersType {
  campaigns: string[];
  dataSources: string[];
}

interface ControlPanelProps {
  onFiltersApply(filters: FiltersType): void;
  campaigns: SelectOption[];
  dataSourcesOptions: SelectOption[];
}

export const ControlPanel = (props: ControlPanelProps) => {
  const { onFiltersApply, campaigns, dataSourcesOptions } = props;
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState<string[]>([]);

  const onCampaignChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    event: React.ChangeEvent<{}>,
    values: SelectOption[]
  ) => {
    setSelectedCampaigns(values.map((campaign) => campaign.value));
  };

  const onDataSourceChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    event: React.ChangeEvent<{}>,
    values: SelectOption[]
  ) => {
    setSelectedDataSource(values.map((dataSource) => dataSource.value));
  };

  const applyFilters = () => {
    onFiltersApply({
      campaigns: selectedCampaigns,
      dataSources: selectedDataSource,
    });
  };

  return (
    <div className={styles.ControlPanel_container}>
      <h3>Filter dimension values</h3>
      <Autocomplete
        className={styles.ControlPanel_formItem}
        multiple
        id="data-sources"
        options={dataSourcesOptions}
        getOptionLabel={(option: SelectOption) => option.label}
        onChange={onDataSourceChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Datasource"
            placeholder="All"
          />
        )}
      />
      <Autocomplete
        className={styles.ControlPanel_formItem}
        multiple
        id="campaigns"
        options={campaigns}
        getOptionLabel={(option: SelectOption) => option.label}
        onChange={onCampaignChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Campaigns"
            placeholder="All"
          />
        )}
      />
      <div className={styles.ControlPanel_formItem}>
        <Button onClick={applyFilters} variant="contained">
          Apply
        </Button>
      </div>
    </div>
  );
};
