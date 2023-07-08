import fetchClient from '@/utils/fetchClient';
import { TypePayloadProfile } from '../interfaces';
import { uploadImageService } from '@/utils/utils';

export const getProfileService = async () => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get('users/me');
};

export const updateProfileService = async (payload: TypePayloadProfile) => {
  const httpFetchClient = new fetchClient();
  return await httpFetchClient.put('users/me', {
    ...payload
  });
};
