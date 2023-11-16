import fetchClient from '@/utils/fetchClient';
import type {
  CreateBulkItemBox,
  CreateOrderItemPackages,
  PayloadBulkShip,
  PayloadCancelOrder,
  PayloadCreateInvoice,
  PayloadCreateTokenInvoice,
  PayloadRefreshToken,
  PayloadValidateShipTo,
  SaveShipmentDetail,
  UpdateOrderItemPackages,
  UpdateShipFrom
} from '../interface';
import { CreateBoxPackageType } from '../constants';

// Rest API

export const getOrderService = async ({
  search,
  page,
  status,
  retailer,
  rowsPerPage,
  sortBy
}: {
  search: string;
  page: number;
  status?: string;
  retailer?: string;
  rowsPerPage: number;
  sortBy: string;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `retailer-purchase-orders?ordering=${sortBy}&search=${search}&offset=${
      page * rowsPerPage
    }&limit=${rowsPerPage}&status=${status || ''}&batch__retailer__name=${retailer || ''}`
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

export const getNewOrderDetailService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`retailer-purchase-orders/${id}`);
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

export const verifyAddressService = async (id: number, payload: PayloadValidateShipTo) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(`retailer-purchase-orders/${id}/address/validate`, payload);
};

export const revertAddressService = async (id: number, payload: PayloadValidateShipTo) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(`retailer-purchase-orders/${id}/address/validate`, payload);
};

export const createShipmentService = async (data: {
  id: number;
  carrier: number;
  shipping_service: string;
  shipping_ref_1: string;
  shipping_ref_2: string;
  shipping_ref_3: string;
  shipping_ref_4: string;
  shipping_ref_5: string;
  gs1: number;
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

export const createBoxPackageService = async (is_check: boolean, payload: CreateBoxPackageType) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(`order_packages?is_check=${is_check}`, payload);
};

export const createBulkBoxPackageService = async (payload: CreateBulkItemBox, order_id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(`order_packages/bulk?purchase_order_id=${order_id}`, payload);
};

export const updateShipToService = async (id: number, payload: PayloadValidateShipTo) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(`retailer-purchase-orders/${id}/address/validate`, payload);
};

export const updateShipFromService = async (id: number, payload: UpdateShipFrom) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(`retailer-purchase-orders/${id}/ship-from-address`, payload);
};

export const resetPackageService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`retailer-purchase-orders/${id}/package/reset`);
};

export const saveShipmentDetailService = async (payload: SaveShipmentDetail) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.patch(`retailer-purchase-orders/${payload.id}`, payload);
};

export const saveOrderPackageDetailService = async (payload: any[]) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`order_packages/bulk`, payload);
};

export const createAcknowledgeBulkService = async (order_id: number[]) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(
    `retailer-purchase-orders/acknowledge/bulk?retailer_purchase_order_ids=${order_id}`
  );
};

export const verifyAddBulkService = async (order_id: number[]) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(
    `retailer-purchase-orders/address/validate/bulk?retailer_purchase_order_ids=${order_id}`
  );
};

export const shipBulkService = async (payload: PayloadBulkShip[]) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('retailer-purchase-orders/ship/bulk', payload);
};

export const getShippingService = async ({
  search,
  service,
  page,
  rowsPerPage
}: {
  search: string;
  service: number;
  page: number;
  rowsPerPage: number;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `shipping_service_type?ordering=created_at&search=${search}${
      service ? `&service=${service}` : ''
    }&offset=${page * rowsPerPage}&limit=${rowsPerPage}`
  );
};

export const getInvoiceService = async () => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get('invoices/authorization-url');
};

export const createTokenInvoiceService = async (payload: PayloadCreateTokenInvoice) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('invoices/token', payload);
};

export const createInvoiceService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(`retailer-purchase-orders/${id}/invoice`);
};

export const refreshTokenService = async (payload: PayloadRefreshToken) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('invoices/refresh-token', payload);
};

export const shipConfirmationService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(`retailer-purchase-orders/${id}/shipment-confirmation`);
};

export const invoiceConfirmationService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(`invoices/${id}/xml`);
};

export const cancelOrderService = async (id: number, payload: PayloadCancelOrder[]) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(`retailer-purchase-orders/${id}/shipment-cancel`, payload);
};

export const byPassService = async (order_id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `retailer-purchase-orders/acknowledge/bypass?order_ids=${order_id}`
  );
};

export const deleteBulkPackageService = async (ids: number[]) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`order_packages/bulk?ids=${ids}`);
};

export const updateBackOrderService = async (data: {
  estimated_ship_date: string;
  estimated_delivery_date: string;
  id: number;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.patch(`retailer-purchase-orders/${data.id}`, data);
};

export const importBackOrderService = async (data: {
  estimated_ship_date: string;
  estimated_delivery_date: string;
  id: number;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(`retailer-purchase-orders/${data.id}/backorder`, data);
};

export const updateWarehouseOrderService = async (
  data: { warehouse: number },
  order_id: number
) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.patch(`retailer-purchase-orders/${order_id}`, data);
};
