import { Dispatch } from 'react';

export type Box = {
  id: number | string;
  name: string;
  length: number;
  width: number;
  height: number;
  dimension_unit: string;
  max_quantity: number;
  barcode_size: BarcodeSize;
  created_at?: string;
};

export type ListBoxType = {
  count: number;
  next: string;
  previous: string;
  results: Box[];
};

export type BarcodeSize = {
  id: number | string;
  name: string;
  width: number;
  height: number;
  multiple_per_label: boolean;
  created_at: string;
  updated_at: string;
  organization: number | string;
};

export type BoxStateType = {
  isLoading: boolean;
  isLoadingCreate: boolean;
  errorMessage: string;
  barcodeSize: BarcodeSize[];
};

export type ContextType = {
  state: BoxStateType;
  dispatch: Dispatch<any>;
};

export type GetPayload = {
  search: string;
  currentPage: number;
};

export type CreateBoxType = {
  name: string;
  length: number;
  width: number;
  height: number;
  dimension_unit: string;
  max_quantity: number;
  barcode_size: number;
};

export type FormCreateBox = {
  name: string;
  length: number;
  width: number;
  height: number;
  dimension_unit: string;
  max_quantity: number;
  barcode_size: {
    value: number;
    label: string;
  };
};
