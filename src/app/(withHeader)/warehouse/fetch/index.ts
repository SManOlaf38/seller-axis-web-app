import fetchClient from '@/utils/fetchClient';
import { CreateRetailerWarehouse } from '../interface';

// Rest API

export const getRetailerWarehouseService = async ({
  search,
  page,
  rowsPerPage
}: {
  search: string;
  page: number;
  rowsPerPage: number;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `retailer-warehouses?ordering=-created_at&search=${search}&offset=${
      page * rowsPerPage
    }&limit=${rowsPerPage}`
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

  return await httpFetchClient.get(
    `retailers?ordering=-created_at&search=${search}&offset=${page * 10}&limit=10`
  );
};
