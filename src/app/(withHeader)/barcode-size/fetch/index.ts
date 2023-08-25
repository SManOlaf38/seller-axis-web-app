import fetchClient from '@/utils/fetchClient';
import { CreateBarcodeSizeType } from '../interface';

export const createBarcodeSizeService = async (payload: CreateBarcodeSizeType) => {
  const httpFetchClient = new fetchClient();
  return await httpFetchClient.post('barcode-sizes', payload);
};

export const getBarcodeSizeService = async ({
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
    `barcode-sizes?ordering=-created_at&search=${search}&offset=${
      page * rowsPerPage
    }&limit=${rowsPerPage}`
  );
};

export const deleteBarcodeSizeService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`barcode-sizes/${id}`);
};

export const getDetailBarcodeSizeService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`barcode-sizes/${id}`);
};

export const updateBarcodeSizeService = async (payload: CreateBarcodeSizeType, id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`barcode-sizes/${id}`, payload);
};
