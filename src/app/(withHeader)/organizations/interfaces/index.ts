
export interface IOrganizationDetail {
  name: string,
  avatar: File | string | null,
  description: string,
  address: string,
  email: string,
  phone: string,
  status: string,
}

export interface IOrganizations {
  id: number,
  name: string,
  email: string,
  role: string,
  created_at: string
}

export type InviteType = {
  email: string,
  role: string,
  callback?: () => void
}

export type InviteMemberType = {
  open: boolean,
  errorMessage?: string,
  onClose: () => void,
  onSubmit: (data: InviteType) => void,
  isLoading: boolean,
  callback?: () => void,
}