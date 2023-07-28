import fetchClient from '@/utils/fetchClient';

// Rest API

export const getOrderService = async ({ search, page }: { search: string; page: number }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `retailer-purchase-orders?ordering=-created_at&search=${search}&offset=${page * 10}&limit=10`
  );
};

export const getCountNewOrderService = async () => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`retailer-purchase-orders/check`);
};

export const getNewOrderService = async () => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`retailer-purchase-orders/import`);
};

export const createAcknowledgeService = async (order_id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(`retailer-purchase-orders/${order_id}/acknowledge`);
};

export const deleteOrderPackageService = async (order_id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`order_packages/${order_id}`);
};

export const getOrderDetailServer = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`retailer-purchase-orders/${id}`);
};

export const verifyAddressService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(`retailer-purchase-orders/${id}/address/validate`);
};

export const createShipmentService = async (data: {
  id: number;
  carrier_id: number;
  retailer_person_place_id: number;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(`retailer-purchase-orders/${data.id}/shipments`, data);
};
