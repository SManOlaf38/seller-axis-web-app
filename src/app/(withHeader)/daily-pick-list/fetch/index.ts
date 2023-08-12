import fetchClient from '@/utils/fetchClient';

export const getDailyPickListService = async () => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get('retailer-purchase-orders/daily-picklist');
};
