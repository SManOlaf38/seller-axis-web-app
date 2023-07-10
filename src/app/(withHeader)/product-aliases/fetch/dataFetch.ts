import httpFetch from '@/utils/fetchRestAPI';

export const getProductAliasDetailServer = async (id: string) => {
  const httpFetchClient = new httpFetch();
  return await httpFetchClient.get(`product-aliases/${id}`);
};
