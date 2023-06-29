import * as actions from './constants';

export const loginRequest = () => ({
  type: actions.LOGIN_REQUEST,
});

export const loginSuccess = (payload: string) => ({
  type: actions.LOGIN_SUCCESS,
  payload,
});

export const loginFail = (payload: string) => ({
  type: actions.LOGIN_FAIL,
  payload,
});

export const registerRequest = () => ({
  type: actions.REGISTER_REQUEST,
});

export const registerSuccess = (payload: string) => ({
  type: actions.REGISTER_SUCCESS,
  payload,
});

export const registerFail = (payload: string) => ({
  type: actions.REGISTER_FAIL,
  payload,
});

export const forgotPasswordRequest = () => ({
  type: actions.FORGOT_PASSWORD_REQUEST,
});

export const forgotPasswordSuccess = (payload: string) => ({
  type: actions.FORGOT_PASSWORD_SUCCESS,
  payload,
});

export const forgotPasswordFail = (payload: string) => ({
  type: actions.FORGOT_PASSWORD_FAIL,
  payload,
});

export const backSendEmail = () => ({
  type: actions.BACK_SEND_EMAIL,
});

export const verifyEmailRequest = () => ({
  type: actions.VERIFY_EMAIL_REQUEST,
});

export const verifyEmailSuccess = (payload: string) => ({
  type: actions.VERIFY_EMAIL_SUCCESS,
  payload,
});

export const verifyEmailFail = (payload: string) => ({
  type: actions.VERIFY_EMAIL_FAIL,
  payload,
});

export const resetPasswordRequest = (
  payload: object,
  callback: () => void,
) => ({
  type: actions.RESET_PASSWORD_REQUEST,
  payload: { payload, callback },
});

export const resetPasswordSuccess = (payload: string) => ({
  type: actions.RESET_PASSWORD_SUCCESS,
  payload,
});

export const resetPasswordFail = (payload: string) => ({
  type: actions.RESET_PASSWORD_FAIL,
  payload,
});
