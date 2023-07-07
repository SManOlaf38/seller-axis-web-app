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
