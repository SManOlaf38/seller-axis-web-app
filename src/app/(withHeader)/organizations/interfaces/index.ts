export interface OrganizationDetailType {
  name: string;
  avatar: File | string | null;
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

export type InviteType = {
  email: string;
  role: string;
  callback?: () => void;
};

export type InviteMemberType = {
  open: boolean;
  errorMessage?: string;
  onModalMenuToggle: () => void;
  onSubmitData: (data: InviteType) => void;
  isLoading: boolean;
  callback?: () => void;
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

export interface PayloadType {
  search: string;
  rowsPerPage: number;
  page: number;
}
