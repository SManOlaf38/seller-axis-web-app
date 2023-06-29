import * as constant from './constant';
import { IAuth } from './type';

export const initialState: IAuth = {
  isLoading: false,
  isChecked: false,
  verifySucceed: '',
  errorMessage: '',
};

function AuthReducer(
  state: IAuth,
  action: {
    type: string;
    payload: any;
  },
) {
  switch (action.type) {
    // GET
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
      };
    }

    case constant.SEND_EMAIL_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case constant.SEND_EMAIL_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        isChecked: true,
      };
    }
    case constant.SEND_EMAIL_FAIL: {
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
        isLoading: false,
        isChecked: true,
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
      };
    }
    case constant.FORGOT_PASSWORD_FAIL: {
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
