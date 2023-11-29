import { ReadonlyURLSearchParams } from 'next/navigation';
import { utils, write, read } from 'xlsx';
import dayjs from 'dayjs';

import fetchClient from './fetchClient';
import { DataFileDownload, HeaderFileDownload } from '@/app/(withHeader)/product-aliases/interface';
import { ReferenceNameRegex, resetOrientation } from '@/constants';

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
      const binaryData = event?.target?.result as ArrayBuffer;
      const workbook = read(binaryData, { type: 'array', cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = utils.sheet_to_json(sheet, { header: 1 });
      resolve(jsonData);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
    fileReader.readAsArrayBuffer(file);
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

export function mapKeys(obj: any, keyMap: { label: string; key: string }[]) {
  return Object.keys(obj).reduce((result: any, key: string) => {
    const label = keyMap.find((item) => item.label === key);
    result[label ? label.key : key] = obj[key];
    return result;
  }, {});
}

export const hasMismatch = (value: string, serviceShip: string[]) => {
  const matches = value?.match(ReferenceNameRegex);

  if (!matches) {
    return false;
  }
  const mismatches = matches
    ?.map((str) => str.substr(2, str.length - 4))
    ?.filter((name) => !serviceShip?.includes(name));

  return mismatches?.length > 0;
};

export function generateSimpleExcel(body: (string | number)[][], headers: string[]) {
  const data = [headers, ...body];

  const workbook = utils.book_new();
  const worksheet = utils.aoa_to_sheet(data);

  utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });

  return new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
}

export const formatDateFromExcel = (dateString: string) => {
  const originalDate = new Date(dateString);
  originalDate.setDate(originalDate.getDate() + 1);

  const isoDate = originalDate.toISOString();

  return isoDate;
};

export const compareArrays = (arr1: Array<string | unknown>, arr2: Array<string | unknown>) => {
  return arr1?.length === arr2?.length && arr1?.every((value, index) => value === arr2[index]);
};

export const convertValueToJSON = (value: unknown) => {
  return value ? JSON.stringify(value) : undefined;
};

export const truncateText = (text: string, maxLength: number) => {
  return text?.length > maxLength ? `${text?.substring(0, maxLength)}...` : text;
};

export const convertFormatDateTime = (date?: string | number | Date | dayjs.Dayjs) => {
  return date ? dayjs(date).format('MM/DD/YYYY') : '-';
};

export const generateNewBase64s = async (data: string) => {
  const res = new Promise((res) => {
    resetOrientation(`data:image/gif;base64,${data}`, 6, function (resetBase64Image) {
      res(resetBase64Image);
    });
  });

  const temp = await res;

  return temp;
};

export const convertFormatDateHaveTime = (date?: string | number | Date | dayjs.Dayjs) => {
  return date ? dayjs(date).format('MM/DD/YYYY h:mm A') : '-';
};
