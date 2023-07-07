import { Dispatch } from 'react';

export type Retailer = {
  id?: number;
  type: string;
  name: string;
  organization_id?: number;
  created_at?: string;
  update_at?: string;
};

export type ListRetailerType = {
  count: number;
  next: string;
  previous: string;
  results: Retailer[];
};

export type RetailerType = {
  dataRetailer: ListRetailerType;
  detailRetailer: any;
  isLoading: boolean;
  errorMessage: string;
  isLoadingCreate: boolean;
};

export type ContextProfileType = {
  state: RetailerType;
  dispatch: Dispatch<any>;
};
