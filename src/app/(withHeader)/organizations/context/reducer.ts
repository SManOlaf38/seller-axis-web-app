import { OrganizationType } from '../interfaces';
import * as constant from './constant';

export const initialState: OrganizationType = {
  memberOrganization: {
    count: 0,
    next: false,
    previous: false,
    results: [],
    total_page: 0
  },
  organizations: {},
  organizationIds: [],
  isLoading: false,
  errorMessage: '',
  dataOrganization: {},
  roles: []
};

function OrganizationReducer(
  state: OrganizationType,
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    // GET
    case constant.GET_ORGANIZATION_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constant.GET_ORGANIZATION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        organizations: action.payload.organizationsTypes,
        organizationIds: action.payload.organizationsTypeIds
      };
    }
    case constant.GET_ORGANIZATION_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constant.GET_ROLE_REQUEST: {
      return {
        ...state
      };
    }
    case constant.GET_ROLE_SUCCESS: {
      return {
        ...state,
        roles: action.payload
      };
    }
    case constant.GET_ROLE_FAIL: {
      return {
        ...state,
        roles: []
      };
    }

    case constant.GET_ORGANIZATION_MEMBER_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constant.GET_ORGANIZATION_MEMBER_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constant.GET_ORGANIZATION_MEMBER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        memberOrganization: action.payload
      };
    }
    case constant.GET_ORGANIZATION_MEMBER_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    // CREATE
    case constant.CREATE_ORGANIZATION_REQUEST: {
      return {
        ...state,
        isLoading: true,
        errorMessage: ''
      };
    }
    case constant.CREATE_ORGANIZATION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataWarehouse: action.payload,
        errorMessage: ''
      };
    }
    case constant.CREATE_ORGANIZATION_FAIL: {
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload
      };
    }

    // DELETE
    case constant.DELETE_ORGANIZATION_REQUEST: {
      return {
        ...state,
        isLoading: true,
        errorMessage: ''
      };
    }
    case constant.DELETE_ORGANIZATION_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        errorMessage: ''
      };
    }
    case constant.DELETE_ORGANIZATION_FAIL: {
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload
      };
    }

    // UPDATE
    case constant.UPDATE_ORGANIZATION_REQUEST: {
      return {
        ...state,
        isLoading: true,
        errorMessage: ''
      };
    }
    case constant.UPDATE_ORGANIZATION_SUCCESS: {
      const newDataOrg = state.organizations;
      newDataOrg[action.payload.id] = action.payload;
      return {
        ...state,
        isLoading: false,
        errorMessage: '',
        organizations: newDataOrg
      };
    }
    case constant.UPDATE_ORGANIZATION_FAIL: {
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload
      };
    }

    // INVITE
    case constant.INVITE_MEMBER_REQUEST: {
      return {
        ...state,
        isLoading: true,
        errorMessage: ''
      };
    }
    case constant.INVITE_MEMBER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        errorMessage: ''
      };
    }
    case constant.INVITE_MEMBER_FAIL: {
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload
      };
    }

    // UPDATE INVITE MEMBER

    case constant.UPDATE_INVITE_MEMBER_REQUEST: {
      return {
        ...state,
        isLoading: true,
        errorMessage: ''
      };
    }
    case constant.UPDATE_INVITE_MEMBER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        errorMessage: ''
      };
    }
    case constant.UPDATE_INVITE_MEMBER_FAIL: {
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload
      };
    }

    // DELETE MEMBER

    case constant.DELETE_MEMBER_REQUEST: {
      return {
        ...state,
        isLoading: true,
        errorMessage: ''
      };
    }
    case constant.DELETE_MEMBER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        errorMessage: ''
      };
    }
    case constant.DELETE_MEMBER_FAIL: {
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload
      };
    }

    // DETAIL
    case constant.GET_ORGANIZATION_DETAIL_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constant.GET_ORGANIZATION_DETAIL_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataOrganization: {
          [action.payload.id]: {
            ...action.payload
          }
        }
      };
    }
    case constant.GET_ORGANIZATION_DETAIL_FAIL: {
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

export default OrganizationReducer;
