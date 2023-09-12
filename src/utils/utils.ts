import { ReadonlyURLSearchParams } from 'next/navigation';
import { utils, write } from 'xlsx';

import fetchClient from './fetchClient';
import { DataFileDownload, HeaderFileDownload } from '@/app/(withHeader)/product-aliases/interface';

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

export const formatString = (inputString: string) => {
  const words = inputString?.split('_');
  words[0] = words[0]?.charAt(0).toUpperCase() + words[0]?.slice(1);
  return words?.join(' ');
};

export const isValidDate = (dateString: string) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const readFileAsync = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      resolve(event?.target?.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
    fileReader?.readAsText(file);
  });
};

export function generateExcelData(data: DataFileDownload[], headers: HeaderFileDownload[]) {
  const headerKeyMap = {} as never;

  headers?.forEach((header: HeaderFileDownload) => {
    headerKeyMap[header?.label] = header?.key as never;
  });

  const headerRow = headers?.map((header: HeaderFileDownload) => header?.label);

  const rows =
    [
      headerRow,
      ...data?.map((item: DataFileDownload) =>
        headers?.map((header: HeaderFileDownload) => item[headerKeyMap[header?.label]])
      )
    ] || [];

  const workbook = utils.book_new();
  const worksheet = utils.aoa_to_sheet(rows);

  utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });

  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
}
