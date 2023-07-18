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
    `barcode-sizes?search=${payload.search}&offset=${payload.page}&limit=${payload.rowsPerPage}`
  );
};
