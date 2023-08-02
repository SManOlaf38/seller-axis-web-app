import fetchClient from '@/utils/fetchClient';
import { CreateOrderItemPackages, UpdateOrderItemPackages, UpdateShipTo } from '../interface';
import { CreateBoxPackageType } from '../constants';

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

export const revertAddressService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.patch(`retailer-purchase-orders/${id}`, {
    verified_ship_to: null
  });
};

export const createShipmentService = async (data: {
  id: number;
  carrier_id: number;
  retailer_person_place_id: number;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(`retailer-purchase-orders/${data.id}/ship`, data);
};

export const createOrderItemPackagesService = async (payload: CreateOrderItemPackages) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('order_item_packages', payload);
};

export const updateOrderItemPackagesService = async (
  payload: UpdateOrderItemPackages,
  id: number
) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`order_item_packages/${id}`, payload);
};

export const deleteOrderItemPackagesService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`order_item_packages/${id}`);
};

export const createBoxPackageService = async (payload: CreateBoxPackageType) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('order_packages/', payload);
};

export const updateShipToService = async (payload: UpdateShipTo) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.patch(`retailer-person-places/${payload?.id}`, payload);
};

export const resetPackageService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`retailer-purchase-orders/${id}/package/reset`);
};
