import fetchClient from '@/utils/fetchClient';
import { CreateSFTP } from '../interface';

// Rest API

export const getSFTPService = async ({ search, page }: { search: string; page: number }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `retailer-commercehub-sftps?search=${search}&page=${page}&page_size=10`
  );
};

export const createSFTPService = async (payload: CreateSFTP) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('retailer-commercehub-sftps', payload);
};

export const updateSFTPService = async (payload: CreateSFTP) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`retailer-commercehub-sftps/${payload.id}`, payload);
};

export const deleteSFTPService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`retailer-commercehub-sftps/${id}`);
};

export const getRetailerService = async ({ search, page }: { search: string; page: number }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`retailers?search=${search}&page=${page}&page_size=10`);
};

export const downloadOrderService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`retailers/${id}/purchase-orders/import`);
};
