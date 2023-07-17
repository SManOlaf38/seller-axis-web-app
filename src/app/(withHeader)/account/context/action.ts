import * as action from './constant';
import { AccountType } from './type';

export const changePasswordRequest = () => ({
  type: action.CHANGE_PASSWORD_REQUEST
});

export const changePasswordSuccess = () => ({
  type: action.CHANGE_PASSWORD_SUCCESS
});

export const changePasswordFail = () => ({
  type: action.CHANGE_PASSWORD_FAIL
});
