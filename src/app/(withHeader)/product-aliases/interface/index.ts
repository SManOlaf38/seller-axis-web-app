import { Dispatch } from 'react';
import { Product } from '../../products/interface';

export type RetailerWarehouseProduct = {
  created_at: string;
  id: string | number;
  live_data: string | number;
  product_alias: string | number;
  product_warehouse_statices: {
    created_at: string;
    id: string | number;
    next_available_date: string;
    next_available_qty: string | number;
    product_warehouse_id: string | number;
    qty_on_hand: string | number;
    status: string;
    updated_at: string;
  };
  retailer_warehouse: {
    address: string;
    created_at: string;
    description: string;
    id: string | number;
    name: string;
    retailer: string | number;
    updated_at: string;
  };
  updated_at: string;
};

export type ProductAlias = {
  is_live_data?: boolean;
  created_at: string;
  id: number | string;
  merchant_sku: string;
  product?: Product;
  retailer?: {
    created_at: string;
    id: number | string;
    name: string;
    organization: number | string;
    type: string;
    updated_at: string;
  };
  retailer_warehouse_products?: RetailerWarehouseProduct[];
  sku: string;
  vendor_sku: string;
  updated_at: string;
};

export type ListProductAlias = {
  count: number;
  next: string;
  previous: string;
  results: ProductAlias[];
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

export type ProductAliasStateType = {
  dataProductAlias: ListProductAlias;
  isLoading: boolean;
  isLoadingUpdateProductStatic: boolean;
  isLoadingUpdateLive: boolean;
  error: string;
  dataRetailer: RetailerType[];
  dataProductAliasDetail: ProductAlias;
  isLoadingProductWarehouse: boolean;
};

export type ContextType = {
  state: ProductAliasStateType;
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

export type CreateProductAlias = {
  id?: string | number;
  services: number;
  retailer: number;
  product: number;
  sku: string;
  merchant_sku: string;
  vendor_sku: string;
};

export type ProductAliasValueType = {
  services: PayloadType;
  retailer: PayloadType;
  product: PayloadType;
  sku: string;
  merchant_sku: string;
  vendor_sku: string;
  retailer_warehouse: PayloadType;
  status: string;
  qty_on_hand: number;
  next_available_qty: number;
  next_available_date: string;
};

export type CreateProductWarehouseStaticDataService = {
  product_warehouse_id: number;
  status: string;
  qty_on_hand: number;
  next_available_qty: number;
  next_available_date: string;
};
