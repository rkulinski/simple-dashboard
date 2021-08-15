import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import styles from './styles.module.scss';

interface SelectOption {
  value: string;
  label: string;
}

export interface FiltersType {
  campaign: string;
  dataSources: string[];
}

interface ControlPanelProps {
  onFiltersApply(filters: FiltersType): void;
  campaigns: SelectOption[];
  dataSourcesOptions: SelectOption[];
}

export const ControlPanel = (props: ControlPanelProps) => {
  const { onFiltersApply, campaigns, dataSourcesOptions } = props;
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');

  const onCampaignChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCampaign(event.target.value as string);
  };

  const applyFilters = () => {
    if (selectedCampaign === null) {
      return;
    }

    onFiltersApply({
      campaign: selectedCampaign,
      dataSources: [],
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
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Datasource"
            placeholder="Select data sources"
          />
        )}
      />
      <FormControl
        className={
          styles.ControlPanel_campaignFormControl +
          ' ' +
          styles.ControlPanel_formItem
        }
      >
        <InputLabel id="campaign-select-label">Campaign</InputLabel>
        <Select
          labelId="campaign-select-label"
          id="campaign-select"
          value={selectedCampaign}
          onChange={onCampaignChange}
        >
          {campaigns.map((campaignItem) => (
            <MenuItem value={campaignItem.value} key={campaignItem.value}>
              {campaignItem.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className={styles.ControlPanel_formItem}>
        <Button onClick={applyFilters} variant="contained">
          Apply
        </Button>
      </div>
    </div>
  );
};
