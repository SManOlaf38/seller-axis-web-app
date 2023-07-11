import httpFetch from '@/utils/fetchRestAPI';

export const getSFTPDetailServer = async (id: string) => {
  const httpFetchClient = new httpFetch();
  return await httpFetchClient.get(`retailer-commercehub-sftps/${id}`);
};
