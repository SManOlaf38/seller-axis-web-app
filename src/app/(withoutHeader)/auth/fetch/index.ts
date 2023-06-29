import fetchClient from '@/utils/fetchClient';
import { ILogin, IRegister } from '../interfaces';

const httpFetchClient = new fetchClient();

export const registerService = async (payload: IRegister) => {
  return await httpFetchClient.post(`auth/register`, payload);
};

export const loginService = async (payload: ILogin) => {
  return await httpFetchClient.post(`auth/login`, payload);
};
