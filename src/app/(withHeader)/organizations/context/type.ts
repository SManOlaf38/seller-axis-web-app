
import { Dispatch } from 'react';

export type IOrganization = {
  memberOrganization: {
    count: number,
    next: boolean | null,
    previous: boolean | null,
    results: any[],
    total_page: number,
  };
  isLoading: boolean;
  errorMessage: string;
}

export type IContextWarehouse = {
  state: IOrganization;
  dispatch: Dispatch<any>;
}
