import { PackageRule } from '../interface';
import * as constants from './constant';

export const createPackageRuleRequest = () => ({
  type: constants.CREATE_PACKAGE_RULE_REQUEST
});
export const createPackageRuleSuccess = () => ({
  type: constants.CREATE_PACKAGE_RULE_SUCCESS
});
export const createPackageRuleFailure = (payload: any) => ({
  type: constants.CREATE_PACKAGE_RULE_FAIL,
  payload
});

export const getPackageRuleRequest = () => ({
  type: constants.GET_PACKAGE_RULE_REQUEST
});
export const getPackageRuleSuccess = (payload: PackageRule) => ({
  type: constants.GET_PACKAGE_RULE_SUCCESS,
  payload
});
export const getPackageRuleFailure = (payload: string) => ({
  type: constants.GET_PACKAGE_RULE_FAIL,
  payload
});

export const deletePackageRuleRequest = () => ({
  type: constants.DELETE_PACKAGE_RULE_REQUEST
});
export const deletePackageRuleSuccess = (payload: number) => ({
  type: constants.DELETE_PACKAGE_RULE_SUCCESS,
  payload
});
export const deletePackageRuleFailure = (payload: string) => ({
  type: constants.DELETE_PACKAGE_RULE_FAIL,
  payload
});

export const getDetailPackageRuleRequest = () => ({
  type: constants.GET_DETAIL_PACKAGE_RULE_REQUEST
});
export const getDetailPackageRuleSuccess = (payload: PackageRule) => ({
  type: constants.GET_DETAIL_PACKAGE_RULE_SUCCESS,
  payload
});
export const getDetailPackageRuleFailure = (payload: string) => ({
  type: constants.GET_DETAIL_PACKAGE_RULE_FAIL,
  payload
});

export const updatePackageRuleRequest = () => ({
  type: constants.UPDATE_PACKAGE_RULE_REQUEST
});
export const updatePackageRuleSuccess = () => ({
  type: constants.UPDATE_PACKAGE_RULE_SUCCESS,
});
export const updatePackageRuleFailure = (payload: string) => ({
  type: constants.UPDATE_PACKAGE_RULE_FAIL,
  payload
});
