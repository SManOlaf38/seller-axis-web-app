import { RolesType, createOrganizationType, getOrganizationType } from '../interfaces';
import * as action from './constant';
import { OrganizationMemberType } from './type';

export const getOrganizationRequest = () => ({
  type: action.GET_ORGANIZATION_REQUEST
});

export const getOrganizationSuccess = (payload: getOrganizationType) => ({
  type: action.GET_ORGANIZATION_SUCCESS,
  payload
});

export const getMemberOrganizationRequest = () => ({
  type: action.GET_ORGANIZATION_MEMBER_REQUEST
});

export const getMemberOrganizationFail = (payload: string) => ({
  type: action.GET_ORGANIZATION_MEMBER_FAIL,
  payload
});

export const getMemberOrganizationSuccess = (payload: string) => ({
  type: action.GET_ORGANIZATION_MEMBER_SUCCESS,
  payload
});

export const getOrganizationFail = (payload: string) => ({
  type: action.GET_ORGANIZATION_FAIL,
  payload
});

export const createOrganizationRequest = () => ({
  type: action.CREATE_ORGANIZATION_REQUEST
});

export const createOrganizationSuccess = (payload: createOrganizationType) => ({
  type: action.CREATE_ORGANIZATION_SUCCESS,
  payload
});

export const createOrganizationFail = (payload: string) => ({
  type: action.CREATE_ORGANIZATION_FAIL,
  payload
});

export const deleteOrganizationRequest = () => ({
  type: action.DELETE_ORGANIZATION_REQUEST
});

export const deleteOrganizationSuccess = (payload: number) => ({
  type: action.DELETE_ORGANIZATION_SUCCESS,
  payload
});

export const deleteOrganizationFail = (payload: string) => ({
  type: action.DELETE_ORGANIZATION_FAIL,
  payload
});

export const updateOrganizationRequest = () => ({
  type: action.UPDATE_ORGANIZATION_REQUEST
});

export const updateOrganizationSuccess = () => ({
  type: action.UPDATE_ORGANIZATION_SUCCESS
});

export const updateOrganizationFail = (payload: string) => ({
  type: action.UPDATE_ORGANIZATION_FAIL,
  payload
});

export const inviteMemberRequest = () => ({
  type: action.INVITE_MEMBER_REQUEST
});

export const inviteMemberSuccess = (payload: any) => ({
  type: action.INVITE_MEMBER_SUCCESS,
  payload
});

export const inviteMemberFail = (payload: string) => ({
  type: action.INVITE_MEMBER_FAIL,
  payload
});

export const getOrganizationDetailRequest = () => ({
  type: action.GET_ORGANIZATION_DETAIL_REQUEST
});

export const getOrganizationDetailSuccess = (payload: OrganizationMemberType) => ({
  type: action.GET_ORGANIZATION_DETAIL_SUCCESS,
  payload
});

export const getOrganizationDetailFail = (payload: string) => ({
  type: action.GET_ORGANIZATION_DETAIL_FAIL,
  payload
});

export const getRoleRequest = () => ({
  type: action.GET_ROLE_REQUEST
});

export const getRoleSuccess = (payload: RolesType[]) => ({
  type: action.GET_ROLE_SUCCESS,
  payload
});

export const getRoleFail = (payload: string) => ({
  type: action.GET_ROLE_FAIL,
  payload
});
