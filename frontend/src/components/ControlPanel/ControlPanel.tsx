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
  campaigns?: string[];
  dataSources?: string[];
}

interface ControlPanelProps {
  onFiltersApply(filters: FiltersType): void;
  onCampaignSearch(query: string): void;
  campaigns: SelectOption[];
  dataSourcesOptions: SelectOption[];
  disableApply?: boolean;
}

export const ControlPanel = (props: ControlPanelProps) => {
  const {
    onFiltersApply,
    campaigns,
    dataSourcesOptions,
    onCampaignSearch,
    disableApply = false,
  } = props;
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState<string[]>([]);

  const onCampaignChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    event: React.ChangeEvent<{}>,
    values: SelectOption[]
  ) => {
    setSelectedCampaigns(values.map((campaign) => campaign.value));
  };

  const onCampaignInputChange = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    event: React.ChangeEvent<{}>,
    value: string
  ) => {
    // TODO add debounce + loading state for dropdown or replace with lazy loaded dropdown.
    onCampaignSearch(value);
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
        onInputChange={onCampaignInputChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Campaigns"
            placeholder="Type to search for more..."
          />
        )}
      />
      <div className={styles.ControlPanel_formItem}>
        <Button
          onClick={applyFilters}
          variant="contained"
          disabled={disableApply}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};
