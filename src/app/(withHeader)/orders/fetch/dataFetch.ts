import httpFetch from '@/utils/fetchRestAPI';

export const getOrderDetailServer = async (id: string) => {
  const httpFetchClient = new httpFetch();
  return await httpFetchClient.get(`retailer-purchase-orders/${id}`);
};
