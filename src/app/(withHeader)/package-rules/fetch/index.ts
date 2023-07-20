import fetchClient from '@/utils/fetchClient';
import { PackageRule } from '../interface';

// Rest API

export const createPackageRuleService = async (payload: PackageRule) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('package-rules', payload);
};

export const getPackageRuleService = async ({
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
    `package-rules?search=${search}&offset=${page * rowsPerPage}&limit=${rowsPerPage}`
  );
};

export const deletePackageRuleService = async (id: number) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`package-rules/${id}`);
};

export const getDetailPackageRuleService = async (id: string) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`package-rules/${id}`);
};

export const updatePackageRuleService = async (payload: any, id: string) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`package-rules/${id}`, payload);
};
