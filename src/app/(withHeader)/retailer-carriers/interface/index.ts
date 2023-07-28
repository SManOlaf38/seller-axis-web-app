import { Dispatch } from 'react';

export type RetailerCarrier = {
  client_id: string;
  client_secret: string;
  created_at: string;
  id: number | string;
  updated_at: string;
  retailer: {
    created_at: string;
    id: number | string;
    name: string;
    organization: number | string;
    type: string;
    updated_at: string;
  };
  service: {
    created_at: string;
    general_client_id: string;
    general_client_secret: string;
    id: number | string;
    name: string;
    type: string;
    updated_at: string;
  };
};

export type ListRetailerCarrier = {
  count: number;
  next: string;
  previous: string;
  results: RetailerCarrier[];
  
};

export type RetailerType = {
  created_at: string;
  id: number;
  name: string;
  organization: number;
  type: string;
  updated_at: string;
};

export type RetailerCarrierStateType = {
  dataRetailerCarrier: ListRetailerCarrier;
  isLoading: boolean;
  error: string;
  dataServices: any[];
  dataRetailerCarrierDetail: RetailerCarrier;
};

export type ContextType = {
  state: RetailerCarrierStateType;
  dispatch: Dispatch<any>;
};

export type GetPayloadType = {
  search: string;
  currentPage: number;
};

export type PayloadType = {
  value: number;
  label: string;
};

export type CreateRetailerCarrier = {
  id?: string | number;
  client_id: string;
  client_secret: string;
  service: string | number;
  retailer: string | number;
};

export type RetailerCarrierValueType = {
  client_id: string;
  client_secret: string;
  service: PayloadType;
  retailer: PayloadType;
};
