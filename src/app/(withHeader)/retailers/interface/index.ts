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
  shipping_ref_1_type?: { name: string };
  shipping_ref_2_type?: { name: string };
  shipping_ref_3_type?: { name: string };
  shipping_ref_4_type?: { name: string };
  shipping_ref_5_type?: { name: string };
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

  shipping_ref_1_value: string;
  shipping_ref_2_value: string;
  shipping_ref_3_value: string;
  shipping_ref_4_value: string;
  shipping_ref_5_value: string;
  shipping_ref_1_type: null;
  shipping_ref_2_type: null;
  shipping_ref_3_type: null;
  shipping_ref_4_type: null;
  shipping_ref_5_type: null;
};

export type CreateRetailerPayload = {
  retailer_sftp: {
    sftp_host?: string;
    sftp_username?: string;
    sftp_password?: string;
  };
  ship_from_address: {
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  name: string;
  type: string;
  merchant_id: string;
  qbo_customer_ref_id: string;
  vendor_id: string;
  default_warehouse: number | null;
  default_carrier: number;
  default_gs1: number | null;
};

export type ListRetailerType = {
  count: number;
  next: string;
  previous: string;
  results: Retailer[];
};

export type ShipRefTypeResult = {
  created_at: string;
  data_field: null;
  id: number;
  name: string;
  updated_at: string;
};

export type PayloadShipRefType = {
  count: number;
  next: null;
  previous: null;
  results: [];
};

export type RetailerType = {
  dataRetailer: ListRetailerType;
  detailRetailer: any;
  isLoading: boolean;
  errorMessage: string;
  isLoadingCreate: boolean;
  dataSFTP: any;
  dataShipRefType: PayloadShipRefType;
};

export type ContextProfileType = {
  state: RetailerType;
  dispatch: Dispatch<any>;
};

export type ShipRefType = {
  shipping_ref_1: {
    name: string;
    id: null;
    data_field: null;
  };
  shipping_ref_2: {
    name: string;
    id: null;
    data_field: null;
  };
  shipping_ref_3: {
    name: string;
    id: null;
    data_field: null;
  };
  shipping_ref_4: {
    name: string;
    id: null;
    data_field: null;
  };
  shipping_ref_5: {
    name: string;
    id: null;
    data_field: null;
  };
};
