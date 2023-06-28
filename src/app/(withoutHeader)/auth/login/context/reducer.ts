import * as constant from "./constant";
import { IAuth } from "./type";

export const initialState: IAuth = {
  isLoading: false,
  errorMessage: ''
}

function AuthReducer(state: IAuth, action: {
  type: string,
  payload: any,
}) {
  switch (action.type) {
    // GET
    case constant.LOGIN_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constant.LOGIN_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataWarehouse: action.payload
      };
    }
    case constant.LOGIN_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constant.REGISTER_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constant.REGISTER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataWarehouse: action.payload
      };
    }
    case constant.REGISTER_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}

export default AuthReducer