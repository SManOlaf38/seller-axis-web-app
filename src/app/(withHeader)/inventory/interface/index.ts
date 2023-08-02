import { Product } from '../../products/interface';

export type ProductAlias = {
  created_at: string;
  is_live_data?: boolean;
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
    retailer_queue_history?: RetailerQueueHistory[];
  };
  retailer_warehouse_products?: any;
  retailer_warehouse?: {
    address: string;
    created_at: string;
    description: string;
    id: number;
    name: string;
    retailer: number;
    updated_at: string;
  };
  sku: string;
  vendor_sku: string;
  updated_at: string;
};

export type RetailerQueueHistory = {
  status: string;
  result_url: string;
};

export type RetailerWarehouseProducts = {
  created_at: string;
  id: number;
  product_alias: number;
  product_warehouse_statices: {};
};
