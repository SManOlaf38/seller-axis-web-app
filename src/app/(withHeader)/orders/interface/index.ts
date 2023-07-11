import { Dispatch } from 'react';
import { Control, FieldErrors } from 'react-hook-form';

export type Order = {
  id: number | string;
  batch: any;
  participating_party: any;
  ship_to: any;
  bill_to: any;
  invoice_to: any;
  customer: {
    name: string,
    id: string | number;
    retailer_person_place_id: string;
    title: string;
    address_rate_class: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    day_phone: string;
    night_phone: string;
    partner_person_place_id: string;
    email: string;
    created_at: string;
    updated_at: string;
    retailer: number | string;
  };
  items: any[];
  retailer_purchase_order_id: string;
  transaction_id: string;
  senders_id_for_receiver: string;
  po_number: string;
  order_date: string;
  shipping_code: string;
  sales_division: string;
  vendor_warehouse_id: string;
  cust_order_number: string;
  po_hdr_data: any;
  control_number: string;
  buying_contract: string;
  created_at: string;
  updated_at: string;
};

export type ListOrder = {
  count: number;
  next: string;
  previous: string;
  results: Order[];
};

export type PackageRule = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  organization: number;
};

export type OrderStateType = {
  dataOrder: ListOrder;
  isLoading: boolean;
  error: string;
  orderDetail: Order;
};

export type ContextType = {
  state: OrderStateType;
  dispatch: Dispatch<any>;
};

export type GetPayload = {
  search: string;
  currentPage: number;
};

export type Payload = {
  id?: number;
  name?: string;
};

export type CreateOrder = {
  id?: string;
  sku: string;
  unit_of_measure: string;
  available: string;
  upc: string;
  description: string;
  unit_cost: number;
  qty_on_hand: number;
  qty_reserve: number;
  image: string | undefined;
  package_rule: number;
  cost?: string;
  warehouse?: string;
};

export type FormCreateOrder = {
  sku: string;
  unit_of_measure: string;
  available: string;
  upc: string;
  description: string;
  unit_cost: number;
  qty_on_hand: number;
  qty_reserve: number;
  image: string | undefined;
  package_rule: {
    value: number;
    label: string;
  };
};

export type FormOrderProps = {
  errors: FieldErrors<CreateOrder>;
  control: Control<CreateOrder, any>;
};
