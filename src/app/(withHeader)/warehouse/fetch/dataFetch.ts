import httpFetch from '@/utils/fetchRestAPI';

export const getRetailerWarehouseDetailServer = async (id: number) => {
  const httpFetchClient = new httpFetch();
  return await httpFetchClient.get(`retailer-warehouses/${id}`);
};
