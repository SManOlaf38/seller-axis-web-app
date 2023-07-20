import httpFetch from '@/utils/fetchRestAPI';

export const getProductSeriesDetailServer = async (id: string) => {
  const httpFetchClient = new httpFetch();
  return await httpFetchClient.get(`product-series/${id}`);
};
