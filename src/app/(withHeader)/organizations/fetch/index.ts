import Cookies from 'js-cookie';

import fetchClient from '@/utils/fetchClient';
import type {
  InvitePayload,
  OrganizationDetailType,
  PayloadType,
  createOrganizationType
} from '../interfaces';

export const createOrganizationService = async (payload: createOrganizationType) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post('organizations', payload);
};

export const getOrganizationMemberService = async (payload: PayloadType) => {
  const httpFetchClient = new fetchClient();
  return await httpFetchClient.get(
    `organizations/${payload.id}/members?search=${payload.search}&offset=${payload.page}`
  );
};

export const inviteMemberService = async (payload: InvitePayload) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.post(`organizations/${payload.id}/members`, payload);
};

export const updateInviteMemberService = async (payload: {
  orgId: number;
  id: number | undefined;
  role: number;
}) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`organizations/${payload.orgId}/members/${payload.id}`, payload);
};

export const deleteMemberService = async (payload: { orgId: number; id: number }) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.delete(`organizations/${payload.orgId}/members/${payload.id}`);
};

export const getOrganizationsService = async () => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.get('organizations');
};

export const getOrganizationDetailService = async () => {
  const current_organizations = Cookies.get('current_organizations');
  const httpFetchClient = new fetchClient();
  if (current_organizations) {
    return await httpFetchClient.get(`organizations/${current_organizations}`);
  }
};

export const updateOrganizationsService = async (payload: OrganizationDetailType) => {
  const httpFetchClient = new fetchClient();

  return await httpFetchClient.put(`organizations/${payload.id}`, payload);
};

export const getRolesService = async () => {
  const httpFetchClient = new fetchClient();
  return await httpFetchClient.get(`roles`);
};
