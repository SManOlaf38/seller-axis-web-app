import { Dispatch } from 'react';

export type Product = {
  id: number;
  name: string;
};
export type ProductStateType = {
  dataProduct: {
    count: number;
    next: string;
    previous: string;
    results: Product[];
  };
  isLoading: boolean;
  error: string;
};

export type ContextType = {
  state: ProductStateType;
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
