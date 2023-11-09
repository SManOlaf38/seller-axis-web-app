import { Dispatch } from 'react';
import { DataPackageRule, PackageRule } from '../../products/interface';
import { Box } from '../../box/interface';

export type ProductSeries = {
  id: string | number;
  created_at: string;
  series: number | string;
  updated_at: string;
  package_rules:
    | {
        box: Box;
        created_at: string;
        id: number | string;
        max_quantity: number | string;
        product_series: number | string;
        updated_at: string;
      }[]
    | [];
};

export type ListProductSeries = {
  count: number;
  next: string;
  previous: string;
  results: ProductSeries[];
};

export type ProductSeriesStateType = {
  dataProductSeries: ListProductSeries;
  isLoading: boolean;
  isLoadingDeleteBulk: boolean;
  error: string;
  dataProductSeriesDetail: ProductSeries;
};

export type ContextType = {
  state: ProductSeriesStateType;
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

export type CreateProductSeries = {
  id?: string | number;
  series: string;
};

export type ProductSeriesValueType = {
  series: string;
};

export type CreateProductWarehouseStaticDataService = {
  product_warehouse: number;
  status: string;
  qty_on_hand: number;
  next_available_qty: number;
  next_available_date: string;
};
