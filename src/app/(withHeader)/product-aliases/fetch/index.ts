import fetchClient from '@/utils/fetchClient';
import {
  BodyFileUpload,
  CreateProductAlias,
  CreateProductWarehouseStaticDataService
} from '../interface';

// Rest API

export const getProductAliasService = async ({
  search,
  page,
  rowsPerPage,
  sortingColumn,
  isASCSort,
  retailer
}: {
  search: string;
  page: number;
  rowsPerPage: number;
  sortingColumn: string;
  isASCSort: boolean;
  retailer?: string;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `product-aliases?ordering=${isASCSort ? '' : '-'}${sortingColumn}&search=${search}&retailer=${
      retailer || ''
    }&offset=${page * rowsPerPage}&limit=${rowsPerPage}`
  );
};

export const createProductAliasService = async (payload: CreateProductAlias) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('product-aliases', payload);
};

export const createRetailerWarehouseProductService = async (payload: {
  product_alias: number;
  retailer_warehouse: number;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('retailer-warehouses-products', payload);
};

export const createProductWarehouseStaticDataService = async (
  payload: CreateProductWarehouseStaticDataService
) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('product-warehouse-static-data', payload);
};

export const updateRetailerWarehouseProductService = async (payload: {
  id: number;
  product_alias: number;
  retailer_warehouse: number;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`retailer-warehouses-products/${payload.id}`, payload);
};

export const updateProductWarehouseStaticDataService = async (payload: {
  id: number;
  product_warehouse: number;
  status: string;
  qty_on_hand: number;
  next_available_qty: number;
  next_available_date: string | null;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`product-warehouse-static-data/${payload.id}`, payload);
};

export const deleteRetailerWarehouseProductService = async (payload: { id: number }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`retailer-warehouses-products/${payload.id}`);
};

export const deleteProductWarehouseStaticDataService = async (payload: { id: number }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`product-warehouse-static-data/${payload.id}`);
};

export const updateProductAliasService = async (payload: CreateProductAlias) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`product-aliases/${payload.id}`, payload);
};

export const deleteProductAliasService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`product-aliases/${id}`);
};

export const getRetailerService = async ({ search, page }: { search: string; page: number }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `retailers?ordering=-created_at&search=${search}&offset=${page * 10}&limit=10`
  );
};

export const updateProductStaticBulkService = async (payload: any) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put('product-warehouse-static-data/bulk', payload);
};

export const updateLiveProductAliasService = async (payload: any) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put('product-aliases/bulk', payload);
};

export const downloadInventoryService = async (retailer_ids: number[]) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`retailer-queue-history?retailer_ids=${retailer_ids}&last=true`);
};

export const createBulkProductAliasService = async (payload: BodyFileUpload[]) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('product-aliases/bulk', payload);
};

export const deleteBulkProductAliasService = async (ids: number[]) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`product-aliases/bulk?ids=${ids}`);
};
