import * as constant from './constant';
import { AccountType } from './type';

export const initialState: AccountType = {
  isLoading: false,
  errorMessage: ''
};

function AccountReducer(
  state: AccountType,
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case constant.CHANGE_PASSWORD_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constant.CHANGE_PASSWORD_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constant.CHANGE_PASSWORD_FAIL: {
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

export default AccountReducer;
