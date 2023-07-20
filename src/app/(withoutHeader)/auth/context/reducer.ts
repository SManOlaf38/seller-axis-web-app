import * as constant from './constants';
import type { AuthenticateState } from './types';

export const initialState: AuthenticateState = {
  isLoading: false,
  isChecked: false,
  verifySucceed: '',
  errorMessage: '',
};

function AuthReducer(
  state: AuthenticateState,
  action: {
    type: string;
    payload: any;
  },
) {
  switch (action.type) {
    case constant.LOGIN_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case constant.LOGIN_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case constant.LOGIN_FAIL: {
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload.message
      };
    }

    case constant.REGISTER_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case constant.REGISTER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case constant.REGISTER_FAIL: {
      return {
        ...state,
        isLoading: false,
        errorMessage: action.payload.message
      };
    }

    case constant.FORGOT_PASSWORD_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case constant.FORGOT_PASSWORD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        isChecked: true,
      };
    }
    case constant.FORGOT_PASSWORD_FAIL: {
      return {
        ...state,
        isLoading: false,
        isChecked: false,
      };
    }

    case constant.BACK_SEND_EMAIL: {
      return {
        ...state,
        isLoading: false,
        isChecked: false,
      };
    }

    case constant.VERIFY_EMAIL_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case constant.VERIFY_EMAIL_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        verifySucceed: 'true',
      };
    }

    case constant.VERIFY_EMAIL_FAIL: {
      return {
        ...state,
        isLoading: false,
        verifySucceed: 'false',
      };
    }

    case constant.RESET_PASSWORD_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case constant.RESET_PASSWORD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case constant.RESET_PASSWORD_FAIL: {
      return {
        ...state,
        isLoading: false,
      };
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default AuthReducer;
