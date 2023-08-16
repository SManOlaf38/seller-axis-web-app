import { Dispatch } from 'react';
import { ListSFTP } from '../../sftp/interface';
import { RetailerWarehouse } from '../../warehouse/interface';

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
  dataSFTP: any;
};

export type ContextProfileType = {
  state: RetailerType;
  dispatch: Dispatch<any>;
};
