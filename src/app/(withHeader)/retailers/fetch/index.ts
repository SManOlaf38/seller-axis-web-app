import fetchClient from '@/utils/fetchClient';
import { CreateRetailerPayload, CreateShipFrom } from '../interface';
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
    `retailers?ordering=-created_at&search=${search}&offset=${
      page * rowsPerPage
    }&limit=${rowsPerPage}`
  );
};

export const createRetailerService = async (payload: CreateRetailerPayload) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('retailers', payload);
};

export const deleteRetailerService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`retailers/${id}`);
};

export const getDetailRetailerService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`retailers/${id}`);
};

export const updateRetailerService = async (payload: CreateRetailerPayload, id: string) => {
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

export const updateSFTPService = async (payload: CreateRetailerPayload) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`retailer-commercehub-sftps/${payload.id}`, payload);
};

export const createShipFromService = async (payload: CreateShipFrom) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('address', payload);
};

export const updateShipFromService = async (payload: CreateShipFrom, id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`address/${id}`, payload);
};
