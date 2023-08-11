import { Dispatch } from 'react';

export type OrderItems = {
  purchase_order: string;
  retailer_qtyordered: number;
  _id: string;
};

export type DivideIntoPack = {
  size: string;
  number: number;
};

export type HeaderTable = {
  id: string;
  label: string;
};

export type ContextType = {
  state: DailyPickListStateType;
  dispatch: Dispatch<any>;
};

export type DailyPickListStateType = {
  isLoading: boolean;
  errorMessage: string;
  dataDailyPickList: ListBoxType;
};

export type GetPayload = {
  search: string;
  currentPage: number;
};

export type DailyPickList = {
  product_sku: string;
  group: Group[];
  quantity: number;
  available_quantity: number;
};

export type ListBoxType = {
  count: number;
  next: string;
  previous: string;
  results: DailyPickList[];
};

export type Group = {
  name: string;
  count: number;
  quantity: number;
  total_quantity: number;
};
