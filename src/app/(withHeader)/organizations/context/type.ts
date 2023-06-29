import { Dispatch } from 'react';

export type OrganizationType = {
  memberOrganization: {
    count: number;
    next: boolean | null;
    previous: boolean | null;
    results: any[];
    total_page: number;
  };
  isLoading: boolean;
  errorMessage: string;
};

export type ContextOrganizationType = {
  state: OrganizationType;
  dispatch: Dispatch<any>;
};
