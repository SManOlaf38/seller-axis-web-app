import fetchClient from '@/utils/fetchClient';
import { Retailer } from '../interface';
import { CreateSFTP } from '../../sftp/interface';

export const getRetailerService = async ({
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
    `retailers?ordering=-created_at&search=${search}&offset=${page * rowsPerPage}&limit=${rowsPerPage}`
  );
};

export const createRetailerService = async (payload: Retailer) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('retailers', payload);
};

export const deleteRetailerService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`retailers/${id}`);
};

export const getDetailRetailerService = async (id: string) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`retailers/${id}`);
};

export const updateRetailerService = async (payload: Retailer, id: string) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`retailers/${id}`, payload);
};

export const createSFTPService = async (payload: CreateSFTP) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('retailer-commercehub-sftps', payload);
};

export const getSFTPService = async ({ search, page }: { search: string; page: number }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `retailer-commercehub-sftps?ordering=-created_at&search=${search}&offset=${page * 10}&limit=10`
  );
};

export const updateSFTPService = async (payload: CreateSFTP) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`retailer-commercehub-sftps/${payload.id}`, payload);
};
