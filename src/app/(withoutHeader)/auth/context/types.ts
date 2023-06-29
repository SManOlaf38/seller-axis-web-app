import { Dispatch } from 'react';

export type AuthenticateState = {
  isLoading: boolean;
  isChecked: boolean;
  verifySucceed: string;
  errorMessage: string;
};

export type AuthenticateContext = {
  state: AuthenticateState;
  dispatch: Dispatch<any>;
};
