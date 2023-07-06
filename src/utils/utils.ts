import { ReadonlyURLSearchParams } from 'next/navigation';

import fetchClient from './fetchClient';

const httpFetchClient = new fetchClient();

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const getAvatarUrl = (avatarName?: string) => {
  return avatarName ? avatarName : '/userAccount.svg';
};

export const getPresignedUrl = async () => {
  return await httpFetchClient.get('files/presigned-url');
};

export const uploadImageService = async (image: File, data: any) => {
  try {
    const formData = new FormData();
    formData.append('key', data[0].fields.key);
    formData.append('policy', data[0].fields.policy);
    formData.append('x-amz-algorithm', data[0].fields['x-amz-algorithm']);
    formData.append('x-amz-credential', data[0].fields['x-amz-credential']);
    formData.append('x-amz-date', data[0].fields['x-amz-date']);
    formData.append('x-amz-security-token', data[0].fields['x-amz-security-token']);
    formData.append('x-amz-signature', data[0].fields['x-amz-signature']);
    formData.append('file', image as File);

    await fetch(`${data[0].url}`, {
      method: 'POST',
      body: formData
    });
  } catch (error) {
    console.log('error', error);
  }
};
