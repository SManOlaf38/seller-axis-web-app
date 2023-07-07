import { Dispatch } from 'react';

export type PackageRule = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  organization: number;
};

export type PackageRuleState = {
  isLoading: boolean;
  error: string;
  packageRules: PackageRule[];
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
