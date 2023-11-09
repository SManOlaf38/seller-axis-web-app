import fetchClient from '@/utils/fetchClient';
import { CreateGs1Type } from '../interface';

export const createGs1Service = async (payload: CreateGs1Type) => {
  const httpFetchClient = new fetchClient();
  return await httpFetchClient.post('gs1', payload);
};

export const getGs1Service = async ({
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
    `gs1?ordering=-created_at&search=${search}&offset=${page * rowsPerPage}&limit=${rowsPerPage}`
  );
};

export const deleteGs1Service = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`gs1/${id}`);
};

export const getDetailGs1Service = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`gs1/${id}`);
};

export const updateGs1Service = async (payload: CreateGs1Type, id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`gs1/${id}`, payload);
};

export const deleteBulkGs1Service = async (ids: number[]) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`gs1/bulk?ids=${ids}`);
};
