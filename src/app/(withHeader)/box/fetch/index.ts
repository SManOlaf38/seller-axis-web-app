import fetchClient from '@/utils/fetchClient';
import { CreateBoxType } from '../interface';

const httpFetchClient = new fetchClient();

export const createBoxService = async (payload: CreateBoxType) => {
  return await httpFetchClient.post('boxes', payload);
};

export const getBarcodeSizeService = async (payload: {
  search: string;
  page: number;
  rowsPerPage: number;
}) => {
  return await httpFetchClient.get(
    `barcode-sizes?ordering=-created_at&search=${payload.search}&offset=${payload.page * payload.rowsPerPage}&limit=${
      payload.rowsPerPage
    }`
  );
};

export const getBoxService = async ({
  search,
  page,
  rowsPerPage
}: {
  search: string;
  page: number;
  rowsPerPage: number;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`boxes?ordering=-created_at&search=${search}&offset=${page * rowsPerPage}&limit=${rowsPerPage}`);
};

export const deleteBoxService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`boxes/${id}`);
};

export const getDetailBoxService = async (id: string) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`boxes/${id}`);
};

export const updateBoxService = async (payload: CreateBoxType, id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`boxes/${id}`, payload);
};
