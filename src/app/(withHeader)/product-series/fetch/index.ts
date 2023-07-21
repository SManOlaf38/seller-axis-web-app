import fetchClient from '@/utils/fetchClient';
import { CreateProductSeries, CreateProductWarehouseStaticDataService } from '../interface';

// Rest API

export const getProductSeriesService = async ({
  search,
  page
}: {
  search: string;
  page: number;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`product-series?ordering=-created_at&search=${search}&page=${page * 10}&page_size=10`);
};

export const createProductSeriesService = async (payload: CreateProductSeries) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('product-series', payload);
};

export const updateProductSeriesService = async (payload: CreateProductSeries) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`product-series/${payload.id}`, payload);
};

export const deleteProductSeriesService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`product-series/${id}`);
};
