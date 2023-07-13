import fetchClient from '@/utils/fetchClient';
import { CreateProductAlias } from '../interface';

// Rest API

export const getProductAliasService = async ({
  search,
  page
}: {
  search: string;
  page: number;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`product-aliases?search=${search}&page=${page}&page_size=10`);
};

export const createProductAliasService = async (payload: CreateProductAlias) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('product-aliases', payload);
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

  return await httpFetchClient.get(`retailers?search=${search}&page=${page}&page_size=10`);
};

export const updateProductStaticBulkService = async (payload: any) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put('product-warehouse-static-data/bulk', payload);
};
