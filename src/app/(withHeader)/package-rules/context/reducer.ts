import type { PackageRuleState } from '../interface';
import * as constants from './constant';

export const initialState: PackageRuleState = {
  isLoading: false,
  error: '',
  packageRules: []
};

function PackageRuleReducer(
  state: PackageRuleState,
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {

    case constants.CREATE_PACKAGE_RULE_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.CREATE_PACKAGE_RULE_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.CREATE_PACKAGE_RULE_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default PackageRuleReducer;
