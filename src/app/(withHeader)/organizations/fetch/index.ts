import Cookies from 'js-cookie';

import fetchClient from '@/utils/fetchClient';
import type {
  InvitePayload,
  OrganizationDetailType,
  Payload,
  createOrganizationType
} from '../interfaces';

export const createOrganizationService = async (payload: createOrganizationType) => {
  const httpFetchClient = fetchClient();

  return await httpFetchClient.post('organizations', payload);
};

export const getOrganizationMemberService = async (payload: Payload) => {
  const httpFetchClient = fetchClient();
  return await httpFetchClient.get(
    `organizations/${payload.id}/members?search=${payload.search}&offset=${
      payload.page * payload.rowsPerPage
    }&limit=${payload.rowsPerPage}`
  );
};

export const inviteMemberService = async (payload: InvitePayload) => {
  const httpFetchClient = fetchClient();

  return await httpFetchClient.post(`organizations/${payload.id}/members`, payload);
};

export const updateInviteMemberService = async (payload: {
  orgId: number;
  id: number | undefined;
  role: number;
}) => {
  const httpFetchClient = fetchClient();

  return await httpFetchClient.put(`organizations/${payload.orgId}/members/${payload.id}`, payload);
};

export const deleteMemberService = async (payload: { orgId: number; id: number }) => {
  const httpFetchClient = fetchClient();

  return await httpFetchClient.delete(`organizations/${payload.orgId}/members/${payload.id}`);
};

export const getOrganizationsService = async () => {
  const httpFetchClient = fetchClient();

  return await httpFetchClient.get('organizations?ordering=-created_at&limit=100&offset=0');
};

export const getOrganizationDetailService = async () => {
  const current_organizations = Cookies.get('current_organizations');
  const httpFetchClient = fetchClient();
  if (current_organizations) {
    return await httpFetchClient.get(`organizations/${current_organizations}`);
  }
};

export const updateOrganizationsService = async (payload: OrganizationDetailType) => {
  const httpFetchClient = fetchClient();

  return await httpFetchClient.put(`organizations/${payload.id}`, payload);
};

export const getRolesService = async () => {
  const httpFetchClient = fetchClient();
  return await httpFetchClient.get(`roles`);
};

export const deleteOrganizationService = async (id: number) => {
  const httpFetchClient = fetchClient();

  return await httpFetchClient.delete(`organizations/${id}`);
};

export const updateSandboxOrganizationsService = async (
  payload: {
    is_sandbox: boolean;
  },
  id: number
) => {
  const httpFetchClient = fetchClient();

  return await httpFetchClient.patch(`organizations/${id}`, payload);
};
