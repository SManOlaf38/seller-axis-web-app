import { Dispatch } from 'react';

export type RetailerWarehouse = {
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;

  description: string;
  id: string | number;
  name: string;
  retailer: {
    created_at: string;
    id: number | string;
    name: string;
    organization: number | string;
    type: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
};

export type ListRetailerWarehouse = {
  count: number;
  next: string;
  previous: string;
  results: RetailerWarehouse[];
};

export type PackageRuleType = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  organization: number;
};

export type RetailerType = {
  created_at: string;
  id: number;
  name: string;
  organization: number;
  type: string;
  updated_at: string;
};

export type RetailerWarehouseStateType = {
  dataRetailerWarehouse: ListRetailerWarehouse;
  isLoading: boolean;
  error: string;
  dataRetailerWarehouseDetail: RetailerWarehouse;
};

export type ContextType = {
  state: RetailerWarehouseStateType;
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

export type CreateRetailerWarehouse = {
  id?: string | number;
  retailer: number;
  name: string;
  description: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
};

export type RetailerWarehouseValueType = {
  retailer: PayloadType;
  name: string;
  description: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
};
