import fetchClient from '@/utils/fetchClient';

export const createOrganizationService = async (payload: any) => {
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
