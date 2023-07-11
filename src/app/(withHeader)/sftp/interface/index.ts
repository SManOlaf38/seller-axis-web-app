import { Dispatch } from 'react';

export type SFTP = {
  acknowledgment_sftp_directory: string;
  confirm_sftp_directory: string;
  created_at: string;
  id: string | number;
  inventory_sftp_directory: string;
  invoice_sftp_directory: string;
  payment_sftp_directory: string;
  purchase_orders_sftp_directory: string;
  retailer: string | number;
  return_sftp_directory: string;
  sftp_host: string;
  sftp_password: string;
  sftp_username: string;
  updated_at: string;
};

export type ListSFTP = {
  count: number;
  next: string;
  previous: string;
  results: SFTP[];
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

export type SFTPStateType = {
  dataSFTP: ListSFTP;
  isLoading: boolean;
  error: string;
  dataRetailer: RetailerType[];
  dataSFTPDetail: SFTP;
};

export type ContextType = {
  state: SFTPStateType;
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

export type CreateSFTP = {
  id?: string | number;
  retailer: number;
  sftp_host: string;
  sftp_username: string;
  sftp_password: string;
  purchase_orders_sftp_directory: string;
  acknowledgment_sftp_directory: string;
  confirm_sftp_directory: string;
  inventory_sftp_directory: string;
  invoice_sftp_directory: string;
  return_sftp_directory: string;
  payment_sftp_directory: string;
};

export type SFTPValueType = {
  retailer: PayloadType;
  sftp_host: string;
  sftp_username: string;
  sftp_password: string;
  purchase_orders_sftp_directory: string;
  acknowledgment_sftp_directory: string;
  confirm_sftp_directory: string;
  inventory_sftp_directory: string;
  invoice_sftp_directory: string;
  return_sftp_directory: string;
  payment_sftp_directory: string;
};
