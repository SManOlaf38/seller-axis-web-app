import * as constant from './constant';
import { ProfileType } from './type';

export const initialState: ProfileType = {
  dataProfile: {
    avatar: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: ''
  },
  isLoading: false,
  errorMessage: ''
};

function ProfileReducer(
  state: ProfileType,
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case constant.GET_PROFILE_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constant.GET_PROFILE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataProfile: action.payload
      };
    }
    case constant.GET_PROFILE_FAIL: {
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

export default ProfileReducer;
