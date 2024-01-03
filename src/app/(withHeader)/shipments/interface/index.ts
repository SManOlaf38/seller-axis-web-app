import type { Dispatch } from 'react';
import { Order } from '../../orders/interface';

export type ListOrderType = {
  count: number;
  next: null;
  previous: null;
  results: Order[];
};

export type ShipmentsStateType = {
  listOrder: ListOrderType;
  isLoadingListOrder: boolean;
  isLoadMoreListOrder: boolean;
};

export type ContextType = {
  state: ShipmentsStateType;
  dispatch: Dispatch<any>;
};
