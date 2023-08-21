import * as constants from './constant';
import { AlertType } from './type';

export const initialState: AlertType = {
  isOpen: false,
  content: {
    message: '',
    color: 'success',
    title: '',
    customTimeHide: 2000
  }
};

function AlertReducer(
  state: AlertType,
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case constants.OPEN_ALERT: {
      return {
        ...state,
        isOpen: true,
        content: action.payload
      };
    }
    case constants.CLOSE_ALERT: {
      return {
        ...state,
        isOpen: false,
        content: ''
      };
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default AlertReducer;
