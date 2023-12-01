import fetchClient from '@/utils/fetchClient';
import { ForgotPassword, ILogin, IRegister, VerifyEmail } from '../interfaces';

const httpFetchClient = fetchClient();

export const registerService = async (payload: IRegister) => {
  return await httpFetchClient.post(`auth/register`, payload);
};

export const loginService = async (payload: ILogin) => {
  return await httpFetchClient.post(`auth/login`, payload);
};

export const forgotPasswordService = async (payload: ForgotPassword) => {
  return await httpFetchClient.post('password/reset/', payload);
};

export const changePasswordService = async (payload: VerifyEmail) => {
  return await httpFetchClient.post('password/new-password/', payload);
};
