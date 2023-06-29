import * as action from './constant';

export const loginRequest = () => ({
  type: action.LOGIN_REQUEST,
});

export const loginSuccess = (payload: string) => ({
  type: action.LOGIN_SUCCESS,
  payload,
});

export const loginFail = (payload: string) => ({
  type: action.LOGIN_FAIL,
  payload,
});

export const registerRequest = () => ({
  type: action.REGISTER_REQUEST,
});

export const registerSuccess = (payload: string) => ({
  type: action.REGISTER_SUCCESS,
  payload,
});

export const registerFail = (payload: string) => ({
  type: action.REGISTER_FAIL,
  payload,
});

export const sendEmailRequest = () => ({
  type: action.SEND_EMAIL_REQUEST,
});

export const sendEmailSuccess = (payload: string) => ({
  type: action.SEND_EMAIL_SUCCESS,
  payload,
});

export const sendEmailFail = (payload: string) => ({
  type: action.SEND_EMAIL_FAIL,
  payload,
});

export const backSendEmail = () => ({
  type: action.BACK_SEND_EMAIL,
});

export const verifyEmailRequest = () => ({
  type: action.VERIFY_EMAIL_REQUEST,
});

export const verifyEmailSuccess = (payload: string) => ({
  type: action.VERIFY_EMAIL_SUCCESS,
  payload,
});

export const verifyEmailFail = (payload: string) => ({
  type: action.VERIFY_EMAIL_FAIL,
  payload,
});

export const forgotPasswordRequest = (
  payload: object,
  callback: () => void,
) => ({
  type: action.FORGOT_PASSWORD_REQUEST,
  payload: { payload, callback },
});

export const forgotPasswordSuccess = (payload: string) => ({
  type: action.FORGOT_PASSWORD_SUCCESS,
  payload,
});

export const forgotPasswordFail = (payload: string) => ({
  type: action.FORGOT_PASSWORD_FAIL,
  payload,
});
