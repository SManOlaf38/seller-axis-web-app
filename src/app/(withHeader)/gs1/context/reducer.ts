import { Gs1StateType } from '../interface';
import * as constants from './constant';

export const initialState: Gs1StateType = {
  isLoading: false,
  isLoadingCreate: false,
  errorMessage: '',
  dataGs1: [],
  detailGs1: {
    id: 0,
    name: '',
    gs1: '',
    created_at: ''
  }
};

function BarcodeSizeReducer(
  state: Gs1StateType,
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case constants.CREATE_GS1_REQUEST: {
      return {
        ...state,
        isLoadingCreate: true,
        errorMessage: ''
      };
    }
    case constants.CREATE_GS1_SUCCESS: {
      return {
        ...state,
        isLoadingCreate: false
      };
    }
    case constants.CREATE_GS1_FAIL: {
      return {
        ...state,
        isLoadingCreate: false,
        errorMessage: action.payload
      };
    }

    case constants.GET_GS1_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_GS1_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataGs1: action.payload
      };
    }
    case constants.GET_GS1_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.DELETE_GS1_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.DELETE_GS1_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.DELETE_GS1_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.GET_DETAIL_GS1_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_DETAIL_GS1_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        detailGs1: action.payload
      };
    }
    case constants.GET_DETAIL_GS1_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.UPDATE_GS1_REQUEST: {
      return {
        ...state,
        isLoadingCreate: true,
        errorMessage: ''
      };
    }
    case constants.UPDATE_GS1_SUCCESS: {
      return {
        ...state,
        isLoadingCreate: false
      };
    }
    case constants.UPDATE_GS1_FAIL: {
      return {
        ...state,
        isLoadingCreate: false,
        errorMessage: action.payload
      };
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default BarcodeSizeReducer;
