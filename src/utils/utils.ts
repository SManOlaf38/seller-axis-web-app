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
    formData.append('key', data.fields.key);
    formData.append('policy', data.fields.policy);
    formData.append('x-amz-algorithm', data.fields['x-amz-algorithm']);
    formData.append('x-amz-credential', data.fields['x-amz-credential']);
    formData.append('x-amz-date', data.fields['x-amz-date']);
    formData.append('x-amz-security-token', data.fields['x-amz-security-token']);
    formData.append('x-amz-signature', data.fields['x-amz-signature']);
    formData.append('file', image as File);

    await fetch(`${data.url}`, {
      method: 'POST',
      body: formData
    });
  } catch (error) {
    console.log('error', error);
  }
};

export const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isEmptyObject = (obj: unknown): boolean => {
  if (obj === null || typeof obj !== 'object') {
    return true;
  }
  return Object.keys(obj).length === 0;
};

export const checkTwoObjects = (obj1: any, obj2: any) => {
  for (let key in obj1) {
    if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
      if (obj1[key] !== obj2[key]) {
        return true;
      }
    }
  }
  return false;
};

export const convertDateToISO8601 = (param: string) => {
  if (param.includes('T') || param.includes('Z')) {
    return param;
  }
  const date = param.split('-');
  const newDate = new Date(Date.UTC(+date[0], +date[1] - 1, +date[2]));
  return newDate.toISOString();
};