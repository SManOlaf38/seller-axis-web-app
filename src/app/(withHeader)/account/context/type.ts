import { Dispatch } from 'react';

export type AccountType = {
  isLoading: boolean;
  errorMessage: string;
};

export type ContextAccountType = {
  state: AccountType;
  dispatch: Dispatch<any>;
};

export type TypePayloadAccount = {
  old_password: string;
  new_password: string;
};
