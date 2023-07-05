import { Dispatch } from 'react';
import { resultsOrganizationType } from '../interfaces';

import type { OrganizationDetailType, RolesType } from '../interfaces';

export type OrganizationMemberType = {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  role: number;
};

export type OrganizationType = {
  memberOrganization: {
    count: number;
    next: boolean | null;
    previous: boolean | null;
    results: OrganizationMemberType[];
    total_page: number;
  };
  organizations: {
    count: number;
    next: boolean | null;
    previous: boolean | null;
    results: resultsOrganizationType[];
    total_page: number;
  };
  isLoading: boolean;
  errorMessage: string;
  dataOrganization: OrganizationDetailType;
  roles: RolesType[];
};

export type ContextOrganizationType = {
  state: OrganizationType;
  dispatch: Dispatch<any>;
};
