import * as constant from './constant';
import { OrganizationType } from './type';

export const initialState: OrganizationType = {
  memberOrganization: {
    count: 0,
    next: false,
    previous: false,
    results: [],
    total_page: 0,
  },
  organizations: {
    count: 0,
    next: false,
    previous: false,
    results: [],
    total_page: 0,
  },
  isLoading: false,
  errorMessage: '',
};

function OrganizationReducer(
  state: OrganizationType,
  action: {
    type: string;
    payload: any;
  },
) {
  switch (action.type) {
    // GET
    case constant.GET_ORGANIZATION_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case constant.GET_ORGANIZATION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        organizations: action.payload,
      };
    }
    case constant.GET_ORGANIZATION_FAIL: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case constant.GET_ORGANIZATION_MEMBER_FAIL: {
      return {
        ...state,
        isLoading: false,
      };
    }

    case constant.GET_ORGANIZATION_MEMBER_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case constant.GET_ORGANIZATION_MEMBER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        memberOrganization: action.payload,
      };
    }
    case constant.GET_ORGANIZATION_MEMBER_FAIL: {
      return {
        ...state,
        isLoading: false,
      };
    }

    // CREATE
    case constant.CREATE_ORGANIZATION_REQUEST: {
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
      };
    }
    case constant.CREATE_ORGANIZATION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataWarehouse: action.payload,
        errorMessage: '',
      };
    }
    case constant.CREATE_ORGANIZATION_FAIL: {
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload,
      };
    }

    // DELETE
    case constant.DELETE_ORGANIZATION_REQUEST: {
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
      };
    }
    case constant.DELETE_ORGANIZATION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        errorMessage: '',
      };
    }
    case constant.DELETE_ORGANIZATION_FAIL: {
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload,
      };
    }

    // UPDATE
    case constant.UPDATE_ORGANIZATION_REQUEST: {
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
      };
    }
    case constant.UPDATE_ORGANIZATION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        errorMessage: '',
      };
    }
    case constant.UPDATE_ORGANIZATION_FAIL: {
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload,
      };
    }

    // INVITE
    case constant.INVITE_MEMBER_REQUEST: {
      return {
        ...state,
        isLoading: true,
        errorMessage: '',
      };
    }
    case constant.INVITE_MEMBER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        errorMessage: '',
      };
    }
    case constant.INVITE_MEMBER_FAIL: {
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default OrganizationReducer;
