import httpFetch from '@/utils/fetchRestAPI';

export const getRetailerCarrierDetailServer = async (id: string) => {
  const httpFetchClient = new httpFetch();
  return await httpFetchClient.get(`retailer-carriers/${id}`);
};
