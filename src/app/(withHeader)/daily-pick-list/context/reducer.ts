import { DailyPickListStateType } from '../interfaces';
import * as constants from './constant';

export const initialState: DailyPickListStateType = {
  isLoading: false,
  errorMessage: '',
  dataDailyPickList: []
};

function DailyPickListReducer(
  state: DailyPickListStateType,
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case constants.GET_DAILY_PICK_LIST_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_DAILY_PICK_LIST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataDailyPickList: action.payload
      };
    }
    case constants.GET_DAILY_PICK_LIST_FAIL: {
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

export default DailyPickListReducer;
