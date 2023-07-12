import { Dispatch } from 'react';

export type Retailer = {
  id?: number;
  type: string;
  name: string;
  organization_id?: number;
  created_at?: string;
  update_at?: string;

  acknowledgment_sftp_directory?: string;
  confirm_sftp_directory?: string;
  inventory_sftp_directory?: string;
  invoice_sftp_directory?: string;
  payment_sftp_directory?: string;
  purchase_orders_sftp_directory?: string;
  retailer?: string;
  return_sftp_directory?: string;
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
};

export type ContextProfileType = {
  state: RetailerType;
  dispatch: Dispatch<any>;
};
