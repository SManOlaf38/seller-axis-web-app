import fetchClient from '@/utils/fetchClient';

// Rest API

export const getOrderService = async ({ search, page }: { search: string; page: number }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `retailer-purchase-orders?search=${search}&page=${page}&page_size=10`
  );
};
