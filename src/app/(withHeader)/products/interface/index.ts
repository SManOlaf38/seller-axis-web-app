import { Dispatch } from 'react';
import { Control, FieldErrors } from 'react-hook-form';

export type Product = {
  id: number | string;
  sku: string;
  unit_of_measure: string;
  available: string;
  upc: string;
  description: string;
  unit_cost: number;
  qty_on_hand: number;
  qty_reserve: number;
  image: string;
  package_rule: PackageRule;
  created_at?: string;
  update_at?: string;
  organization: number | string;
};

export type ListProductType = {
  count: number;
  next: string;
  previous: string;
  results: Product[];
};

export type PackageRule = {
  id: number | string;
  name: string;
  created_at: string;
  updated_at: string;
  organization: number | string;
};

export type ProductStateType = {
  dataProduct: ListProductType;
  isLoading: boolean;
  error: string;
  packageRules: PackageRule[];
  productDetail: Product;
};

export type ContextType = {
  state: ProductStateType;
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

export type CreateProductType = {
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
  package_rule?: number;
  cost?: string;
  warehouse?: string;
};

export type FormCreateProduct = {
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

export type FormProductProps = {
  errors: FieldErrors<CreateProductType>;
  control: Control<CreateProductType, any>;
};
