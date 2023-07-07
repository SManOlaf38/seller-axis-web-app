import { Dispatch } from 'react';

export type PackageRuleType = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  organization: number;
};

export type PackageRuleStateType = {
  isLoading: boolean;
  error: string;
  packageRules: PackageRuleType[];
};

export type ContextType = {
  state: PackageRuleStateType;
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
