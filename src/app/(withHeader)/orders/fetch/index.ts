import fetchClient from '@/utils/fetchClient';

// Rest API

export const getOrderService = async ({ search, page }: { search: string; page: number }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `retailer-purchase-orders?search=${search}&offset=${page * 10}&limit=10`
  );
};
