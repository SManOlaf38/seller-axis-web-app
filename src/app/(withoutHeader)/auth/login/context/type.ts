
import { Dispatch } from 'react';

export type IAuth = {
  isLoading: boolean;
  errorMessage: string;
}

export type IContextAuth = {
  state: IAuth;
  dispatch: Dispatch<any>;
}
