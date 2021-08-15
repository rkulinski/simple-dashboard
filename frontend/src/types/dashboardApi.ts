export interface DataSourceItemAPI {
  id: number;
  name: string;
}

export interface CampaignItemAPI {
  id: number;
  name: string;
  date: string;
  data_source: DataSourceItemAPI;
  clicks: number;
  impressions: number;
}
