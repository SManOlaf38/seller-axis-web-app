import httpFetch from '@/utils/fetchRestAPI';

export const getProductDetailServer = async (id: string) => {
  const httpFetchClient = new httpFetch();
  return await httpFetchClient.get(`products/${id}`);
};
