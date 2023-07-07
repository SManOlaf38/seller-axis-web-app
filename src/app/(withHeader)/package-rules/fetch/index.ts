import fetchClient from '@/utils/fetchClient';

// Rest API

export const createPackageRuleService = async (payload: { name: string }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('package-rules', payload);
};
