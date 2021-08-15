export interface CampaignItemAPI {
  id: number;
  name: string;
}

export interface DataSourceItemAPI {
  id: number;
  name: string;
  date: string;
  data_source: CampaignItemAPI;
  clicks: number;
  impressions: number;
}
