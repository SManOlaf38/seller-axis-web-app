import { Dispatch } from 'react';

export type ListBarcodeSizeType = {
  count: number;
  next: string;
  previous: string;
  results: BarcodeSize[];
};

export type BarcodeSize = {
  id: number | string;
  name: string;
  width: number;
  height: number;
  multiple_per_label: string;
  created_at: string;
  updated_at: string;
};

export type BarcodeSizeStateType = {
  isLoading: boolean;
  isLoadingCreate: boolean;
  isLoadingBulkDelete: boolean;
  errorMessage: string;
  dataBarcodeSize: ListBarcodeSizeType;
  detailBarcodeSize: any;
};

export type ContextType = {
  state: BarcodeSizeStateType;
  dispatch: Dispatch<any>;
};

export type GetPayload = {
  search: string;
  currentPage: number;
};

export type CreateBarcodeSizeType = {
  name: string;
  width: number;
  height: number;
  multiple_per_label: boolean;
};

export type FormCreateBarcodeSize = {
  name: string;
  width: number;
  height: number;
  multiple_per_label: boolean;
};
