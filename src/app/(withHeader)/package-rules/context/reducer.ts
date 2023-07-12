import type { PackageRuleState } from '../interface';
import * as constants from './constant';

export const initialState: PackageRuleState = {
  isLoading: false,
  error: '',
  dataPackageRule: {
    count: 0,
    next: '',
    previous: '',
    results: []
  },
  detailPackageRule: {}
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

    case constants.GET_PACKAGE_RULE_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_PACKAGE_RULE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataPackageRule: action.payload
      };
    }
    case constants.GET_PACKAGE_RULE_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.DELETE_PACKAGE_RULE_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.DELETE_PACKAGE_RULE_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.DELETE_PACKAGE_RULE_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.GET_DETAIL_PACKAGE_RULE_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_DETAIL_PACKAGE_RULE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        detailPackageRule: action.payload
      };
    }
    case constants.GET_DETAIL_PACKAGE_RULE_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.UPDATE_PACKAGE_RULE_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.UPDATE_PACKAGE_RULE_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.UPDATE_PACKAGE_RULE_FAIL: {
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
