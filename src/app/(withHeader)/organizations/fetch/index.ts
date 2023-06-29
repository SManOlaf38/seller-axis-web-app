import fetchClient from '@/utils/fetchClient';

export const getOrganizationService = async ({
  search,
  page,
  rowsPerPage,
}: any) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(
    `/purchase_order?${search && `search=${search}`
    }&page=${page}&page_size=${rowsPerPage}`,
  );
};

export const createOrganizationService = async (
  payload: any,
) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(`/organization`, payload);
};

export const getOrganizationMemberService = async (id: string) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get(`/organization/${id}`);
};

export const inviteMemberService = async (payload: any) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`/organization/${payload?.id}`, payload);
};


