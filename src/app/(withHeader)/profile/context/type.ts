import { Dispatch } from 'react';
import { DataProfileType } from '../interfaces';

export type ProfileType = {
  dataProfile: DataProfileType;
  isLoading: boolean;
  errorMessage: string;
};

export type ContextProfileType = {
  state: ProfileType;
  dispatch: Dispatch<any>;
};
