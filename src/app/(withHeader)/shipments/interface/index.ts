import type { Dispatch } from 'react';
import type { Notes, Order } from '../../orders/interface';
import type { RetailerWarehouse } from '../../warehouse/interface';

export type ListOrderType = {
  count: number;
  next: null;
  previous: null;
  results: Order[];
};

export type listOrderReturnType = {
  count: number;
  next: null;
  previous: null;
  results: OrderReturn[];
};

export type OrderReturn = {
  created_at: string;
  dispute_at: string;
  dispute_id: string;
  dispute_reason: string;
  dispute_result: string;
  dispute_status: string;
  id: number;
  notes: Notes[];
  order: Order;
  reimbursed_amount: number;
  service: string;
  status: string;
  tracking_number: [];
  updated_at: string;
  updated_dispute_at: string;
  warehouse: RetailerWarehouse;
};

export type ShipmentsStateType = {
  listOrderReturn: listOrderReturnType;
  listOrder: ListOrderType;
  isLoadingListOrder: boolean;
  isLoadMoreListOrder: boolean;
  isLoadingOrderReturn: boolean;
};

export type ContextType = {
  state: ShipmentsStateType;
  dispatch: Dispatch<any>;
};
