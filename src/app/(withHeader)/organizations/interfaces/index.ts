import { Dispatch } from 'react';

export type OrganizationMemberType = {
  id: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  email: string;
  created_at: string;
  updated_at: string;
  role: RolesType;
};

export type OrganizationType = {
  memberOrganization: {
    count: number;
    next: boolean | null;
    previous: boolean | null;
    results: OrganizationMemberType[];
    total_page: number;
  };
  organizations: OrganizationKeyType;
  organizationIds: number[];
  isLoading: boolean;
  errorMessage: string;
  dataOrganization: OrganizationKeyType | object;
  roles: RolesType[];
};

export type OrganizationKeyType = {
  [key: string]: OrganizationDetailType;
};

export type ContextOrganizationType = {
  state: OrganizationType;
  dispatch: Dispatch<any>;
};

export interface OrganizationDetailType {
  name: string;
  avatar: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  status: string;
  timezone: string;
  id?: string;
}

export interface OrganizationsType {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export type RoleType = {
  value: number;
  label: string;
};

export type InviteType = {
  id: string;
  email: string;
  role: RoleType;
  callback?: () => void;
};

export type InvitePayload = {
  id: string;
  email: string;
  role: number;
};

export type InviteMemberType = {
  open: boolean;
  errorMessage?: string;
  onModalMenuToggle: () => void;
  onSubmitData: (data: InviteType) => void;
  isLoading: boolean;
  callback?: () => void;
  roles: RolesType[];
  detailMember: OrganizationMemberType | undefined;
};

export type createOrganizationType = {
  name: string;
};

export type getOrganizationType = {
  count: number;
  next: boolean;
  previous: boolean;
  results: resultsOrganizationType[];
};

export type resultsOrganizationType = {
  id: number;
  name: string;
};

export interface Payload {
  search: string;
  rowsPerPage: number;
  page: number;
  id?: string;
}

export type PermissionType = {
  [key: string]: string;
};

export type RolesType = {
  created_at: string;
  id: number;
  name: string;
  organization: number;
  permissions: PermissionType[];
  updated_at: string;
};
