import fetchClient from '@/utils/fetchClient';
import { CreateProductType } from '../interface';

// Rest API

export const getProductService = async ({
  search,
  page,
  rowsPerPage,
  sortingColumn,
  isASCSort
}: {
  search: string;
  page: number;
  rowsPerPage: number;
  sortingColumn: string;
  isASCSort: boolean;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `products?ordering=${isASCSort ? '' : '-'}${sortingColumn}&search=${search}&offset=${
      page * rowsPerPage
    }&limit=${rowsPerPage}`
  );
};

export const createProductService = async (payload: CreateProductType) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('products', payload);
};

export const updateProductService = async (payload: CreateProductType) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`products/${payload.id}`, payload);
};

export const getPackageRuleService = async (payload: { search: string }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`package-rules?search=${payload.search}`);
};

export const deleteProductService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`products/${id}`);
};

export const createPackageRuleService = async (payload: {
  max_quantity: number;
  product: number;
  box: number;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('package-rules', payload);
};

export const getBoxesService = async ({
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
    `boxes?search=${search}&offset=${page * rowsPerPage}&limit=${rowsPerPage}`
  );
};

export const getProductDetailServer = async (id: number) => {
  const httpFetchClient = new fetchClient();
  return await httpFetchClient.get(`products/${id}`);
};

export const deleteBulkProductService = async (ids: number[]) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`products/bulk?ids=${ids}`);
};

export const createBulkProductService = async (payload: CreateProductType[]) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('products/bulk', payload);
};
