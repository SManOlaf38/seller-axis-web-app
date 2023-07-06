import fetchClient from '@/utils/fetchClient';
import { TypePayloadProfile } from '../interfaces';
import { uploadImageService } from '@/utils/utils';

export const getProfileService = async () => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get('users/me');
};

export const updateProfileService = async (payload: TypePayloadProfile) => {
  const httpFetchClient = new fetchClient();
  if (typeof payload?.avatar === 'string') {
    return await httpFetchClient.put('users/me', payload);
  } else {
    const responseImage = await httpFetchClient.get('files/presigned-url');
    uploadImageService(payload.avatar as File, responseImage);
    return await httpFetchClient.put('users/me', {
      ...payload,
      avatar: `${responseImage[0].url}/${responseImage[0].fields.key}`
    });
  }
};
