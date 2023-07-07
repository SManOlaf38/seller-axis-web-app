import fetchClient from '@/utils/fetchClient';
import { CreateProductType } from '../interface';

// Rest API

export const getProductService = async ({ search, page }: { search: string; page: number }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`products?search=${search}&page=${page}&page_size=10`);
};

export const createProductService = async (payload: CreateProductType) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('products', payload);
};

export const getPackageRuleService = async (payload: { search: string }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`package-rules?search=${payload.search}`);
};

export const deleteProductService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`products/${id}`);
};
