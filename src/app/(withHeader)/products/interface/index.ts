import { Dispatch } from 'react';
import { Control, FieldErrors } from 'react-hook-form';

export type Product = {
  id: number;
  sku: string;
  unit_of_measure: string;
  available: string;
  upc: string;
  description: string;
  unit_cost: number;
  qty_on_hand: number;
  qty_reserve: number;
  image: string;
  package_rule_id: string;
  created_at: string;
  update_at: string;
};

export type ListProductType = {
  count: number;
  next: string;
  previous: string;
  results: Product[];
};

export type ProductStateType = {
  dataProduct: ListProductType;
  isLoading: boolean;
  error: string;
};

export type ContextType = {
  state: ProductStateType;
  dispatch: Dispatch<any>;
};

export type GetPayloadType = {
  search: string;
  currentPage: number;
};

export type PayloadType = {
  id?: number;
  name?: string;
};

export type CreateProductType = {
  sku: string;
  unit_of_measure: string;
  available: string;
  upc: string;
  description: string;
  unit_cost: number;
  qty_on_hand: number;
  qty_reserve: number;
  image: string;
  package_rule: number;
  cost: string;
  warehouse: string;
};

export type FormProductProps = {
  errors: FieldErrors<CreateProductType>;
  control: Control<CreateProductType, any>;
};
