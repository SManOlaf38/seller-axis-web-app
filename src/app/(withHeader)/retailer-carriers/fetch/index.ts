import fetchClient from '@/utils/fetchClient';
import { CreateRetailerCarrier } from '../interface';

// Rest API

export const getRetailerCarrierService = async ({
  search,
  page
}: {
  search: string;
  page: number;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`retailer-carriers?search=${search}&offset=${page * 10}&limit=10`);
};

export const getServicesService = async ({ search, page }: { search: string; page: number }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`services?search=${search}&offset=${page * 10}&limit=10`);
};

export const createRetailerCarrierService = async (payload: CreateRetailerCarrier) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('retailer-carriers', payload);
};

export const updateRetailerCarrierService = async (payload: CreateRetailerCarrier) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`retailer-carriers/${payload.id}`, payload);
};

export const deleteRetailerCarrierService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`retailer-carriers/${id}`);
};

export const getRetailerService = async ({ search, page }: { search: string; page: number }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`retailers?search=${search}&offset=${page * 10}&limit=10`);
};
