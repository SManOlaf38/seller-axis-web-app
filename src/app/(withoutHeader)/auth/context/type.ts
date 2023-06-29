import { Dispatch } from 'react';

export type IAuth = {
  isLoading: boolean;
  isChecked: boolean;
  verifySucceed: string;
  errorMessage: string;
};

export type IContextAuth = {
  state: IAuth;
  dispatch: Dispatch<any>;
};
