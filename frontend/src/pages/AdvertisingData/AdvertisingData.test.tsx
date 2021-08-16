import { aggregateCampaignItems } from 'pages/AdvertisingData/AdvertisingData';
import { getCampaignItem } from 'testingUtils/factories';

describe('AdvertisingData', () => {
  describe('aggregateCampaignItems', () => {
    test('should aggregate clicks correctly', () => {
      const campaignItems = [
        getCampaignItem({
          date: '01.01.2019',
          clicks: 100,
        }),
        getCampaignItem({
          date: '01.02.2012',
          clicks: 200,
        }),
        getCampaignItem({
          date: '01.01.2019',
          clicks: 400,
        }),
      ];

      const result = aggregateCampaignItems(campaignItems, {});

      expect(Object.keys(result).length).toBe(2);
      expect(result['01.01.2019'].clicks).toBe(500);
      expect(result['01.02.2012'].clicks).toBe(200);
    });
  });
});
