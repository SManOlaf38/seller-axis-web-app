import fetchClient from '@/utils/fetchClient';

export const getDailyPickListService = async ({
  page,
  rowsPerPage,
  created_at
}: {
  page: number;
  rowsPerPage: number;
  created_at: string;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `retailer-purchase-orders/daily-picklist?offset=${page * rowsPerPage}&limit=${rowsPerPage}${
      created_at && `&created_at=${created_at}`
    }`
  );
};
