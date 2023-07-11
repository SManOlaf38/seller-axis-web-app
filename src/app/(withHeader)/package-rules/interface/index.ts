import { Dispatch } from 'react';

export type PackageRule = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  organization: number;
  dimension_unit: string;
  height: number;
  length: number;
  wight: number;
};

export type PackageRuleType = {
  count: number;
  next: string;
  previous: string;
  results: PackageRule[];
};

export type PackageRuleState = {
  isLoading: boolean;
  error: string;
  dataPackageRule: PackageRuleType;
  detailPackageRule: any
};

export type ContextType = {
  state: PackageRuleState;
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
