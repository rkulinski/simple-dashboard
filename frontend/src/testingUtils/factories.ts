import faker from 'faker';
import { CampaignItemAPI, DataSourceItemAPI } from 'types/dashboardApi';

export function getDataSourceItem(
  seed: Partial<DataSourceItemAPI> = {}
): DataSourceItemAPI {
  return {
    id: new Date().getTime(),
    name: faker.lorem.word(),
    ...seed,
  };
}

export function getCampaignItem(
  seed: Partial<CampaignItemAPI> = {}
): CampaignItemAPI {
  return {
    id: new Date().getTime(),
    name: faker.lorem.word(),
    date: formatDate(faker.date.past()),
    data_source: {
      id: new Date().getTime(),
      name: faker.lorem.word(),
    },
    clicks: faker.datatype.number({ min: 0 }),
    impressions: faker.datatype.number({ min: 0 }),
    ...seed,
  };
}

function formatDate(date: Date) {
  let month = '' + (date.getMonth() + 1);
  let day = '' + date.getDate();
  const year = date.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [day, month, year].join('.');
}

export function NOOP(): void {
  // NOOP;
}
