import { Dispatch } from 'react';

export type ProductType = {
  id: number;
  name: string;
};
export type StateType = {
  dataProduct: {
    count: number;
    next: string;
    previous: string;
    results: ProductType[];
  };
  loading: boolean;
  error: string;
};

export type ContextType = {
  state: StateType;
  dispatch: Dispatch<any>;
};

export type GetPayloadType = {
  search: string;
  currentPage: number;
};

export type PayloadType = {
  id?: number;
  name?: string;
};
