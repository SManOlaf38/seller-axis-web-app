import fetchClient from '@/utils/fetchClient';

// Rest API

export const getOrderService = async ({ search, page }: { search: string; page: number }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `retailer-purchase-orders?ordering=-created_at&search=${search}&offset=${page * 10}&limit=10`
  );
};

export const createAcknowledgeService = async (payload: { order_id: number }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('retailer-purchase-orders/acknowledge', payload);
};
