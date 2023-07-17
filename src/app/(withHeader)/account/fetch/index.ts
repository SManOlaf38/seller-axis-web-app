import fetchClient from '@/utils/fetchClient';
import { TypePayloadAccount } from '../context/type';

export const changePasswordService = async (payload: TypePayloadAccount) => {
  const httpFetchClient = new fetchClient();
  return await httpFetchClient.put('change-password/', {
    ...payload
  });
};
