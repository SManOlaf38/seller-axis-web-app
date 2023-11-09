import { Dispatch } from 'react';

export type Gs1 = {
  id: number;
  name: string;
  gs1: string;
  created_at: string;
};

export type Gs1StateType = {
  isLoading: boolean;
  isLoadingCreate: boolean;
  isLoadingBulkDelete: boolean;
  errorMessage: string;
  dataGs1: Gs1[];
  detailGs1: Gs1;
};

export type ContextType = {
  state: Gs1StateType;
  dispatch: Dispatch<any>;
};

export type GetPayload = {
  search: string;
  currentPage: number;
};

export type CreateGs1Type = {
  name: string;
  gs1: string;
};
