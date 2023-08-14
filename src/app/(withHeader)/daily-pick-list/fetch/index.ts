import fetchClient from '@/utils/fetchClient';

export const getDailyPickListService = async ({
  page,
  rowsPerPage
}: {
  page: number;
  rowsPerPage: number;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `retailer-purchase-orders/daily-picklist?offset=${page * rowsPerPage}&limit=${rowsPerPage}`
  );
};
