import { ReadonlyURLSearchParams } from 'next/navigation';

import fetchClient from './fetchClient';

const httpFetchClient = new fetchClient();

export const createUrl = (pathname: string, params: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? '?' : ''}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const getPresignedUrl = async () => {
  return await httpFetchClient.get(
    `/pre_signed_url`,
  );
}