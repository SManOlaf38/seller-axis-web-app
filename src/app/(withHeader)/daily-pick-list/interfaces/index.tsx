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
  dataDailyPickList: DailyPickList[];
};

export type GetPayload = {
  search: string;
  currentPage: number;
};

export type DailyPickList = {
  id: number;
  product_sku: string;
  group: Group[];
  quantity: number;
  available_quantity: number;
  product_alias_info: ProductAliasInfo[];
};

export type ProductAliasInfo = {
  packaging: number;
  product_alias_sku: string;
  list_quantity: ListQuantity[];
};

export type ListQuantity = {
  po_number: string;
  quantity: number;
};

export type Group = {
  name: string;
  count: number;
  quantity: number;
  total_quantity: number;
};
