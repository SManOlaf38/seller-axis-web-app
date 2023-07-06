import fetchClient from '@/utils/fetchClient';

export const getProfileService = async () => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get('users/me');
};
