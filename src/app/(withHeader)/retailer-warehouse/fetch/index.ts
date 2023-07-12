import fetchClient from '@/utils/fetchClient';
import { CreateRetailerWarehouse } from '../interface';

// Rest API

export const getRetailerWarehouseService = async ({
  search,
  page
}: {
  search: string;
  page: number;
}) => {
  const httpFetchClient = new fetchClient();
  
  return await httpFetchClient.get(
    `retailer-warehouses?search=${search}&page=${page}&page_size=10`
  );
};

export const createRetailerWarehouseService = async (payload: CreateRetailerWarehouse) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('retailer-warehouses', payload);
};

export const updateRetailerWarehouseService = async (payload: CreateRetailerWarehouse) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`retailer-warehouses/${payload.id}`, payload);
};

export const deleteRetailerWarehouseService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`retailer-warehouses/${id}`);
};

export const getRetailerService = async ({ search, page }: { search: string; page: number }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`retailers?search=${search}&page=${page}&page_size=10`);
};
