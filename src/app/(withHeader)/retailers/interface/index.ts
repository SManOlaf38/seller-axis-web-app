import { Dispatch } from 'react';
import { ListSFTP } from '../../sftp/interface';
import { RetailerWarehouse } from '../../warehouse/interface';
import { RetailerCarrier } from '../../carriers/interface';

export type Retailer = {
  id?: number;
  type: string;
  name: string;
  merchant_id: string;
  organization_id?: number;
  created_at?: string;
  update_at?: string;
  qbo_customer_ref_id: string;

  default_warehouse?: RetailerWarehouse;
  default_carrier: RetailerCarrier;
  default_gs1?: {
    name: string;
    gs1: string;
    id: number;
  };
  retailer?: string;
  return_sftp_directory?: string;
  sftp_host?: string;
  sftp_password?: string;
  sftp_username?: string;
};

export type CreateRetailer = {
  id?: number;
  type: string;
  name: string;
  merchant_id: string;
  qbo_customer_ref_id: string;
  vendor_id: string;
  default_warehouse: {
    value: number;
    label: string;
  };
  default_carrier: {
    value: number;
    label: string;
  };
  default_gs1: {
    value: number;
    label: string;
  };

  sftp_host?: string;
  sftp_password?: string;
  sftp_username?: string;
  ship_from_address: {
    id: number;
  };

  company?: string;
  contact_name?: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  email?: string;
  verified_carrier: null;
};

export type CreateShipFrom = {
  retailer_id?: number;
  company?: string;
  contact_name?: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  email?: string;
  status?: string;
  verified_carrier: null;
};

export type CreateRetailerPayload = {
  id?: number;
  type: string;
  name: string;
  merchant_id: string;
  qbo_customer_ref_id: string;
  vendor_id: string;
  default_warehouse?: number;
  default_carrier?: number;
  default_gs1?: number | undefined;
  retailer?: number;
  ship_from_address?: number;

  sftp_host?: string;
  sftp_password?: string;
  sftp_username?: string;
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
  dataSFTP: any;
};

export type ContextProfileType = {
  state: RetailerType;
  dispatch: Dispatch<any>;
};
