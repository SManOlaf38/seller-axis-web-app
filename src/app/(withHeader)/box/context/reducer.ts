import { BoxStateType } from '../interface';
import * as constants from './constant';

export const initialState: BoxStateType = {
  isLoading: false,
  isLoadingCreate: false,
  errorMessage: '',
  barcodeSize: []
};

function BoxReducer(
  state: BoxStateType,
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case constants.CREATE_BOX_REQUEST: {
      return {
        ...state,
        isLoadingCreate: true,
        errorMessage: ''
      };
    }
    case constants.CREATE_BOX_SUCCESS: {
      return {
        ...state,
        isLoadingCreate: false
      };
    }
    case constants.CREATE_BOX_FAIL: {
      return {
        ...state,
        isLoadingCreate: false,
        errorMessage: action.payload
      };
    }

    case constants.GET_BOX_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_BOX_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.GET_BOX_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.DELETE_BOX_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.DELETE_BOX_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.DELETE_BOX_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.GET_DETAIL_BOX_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_DETAIL_BOX_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        detailBox: action.payload
      };
    }
    case constants.GET_DETAIL_BOX_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.UPDATE_BOX_REQUEST: {
      return {
        ...state,
        isLoadingCreate: true,
        errorMessage: ''
      };
    }
    case constants.UPDATE_BOX_SUCCESS: {
      return {
        ...state,
        isLoadingCreate: false
      };
    }
    case constants.UPDATE_BOX_FAIL: {
      return {
        ...state,
        isLoadingCreate: false,
        errorMessage: action.payload
      };
    }

    case constants.GET_BARCODE_SIZE_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_BARCODE_SIZE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        barcodeSize: action.payload
      };
    }
    case constants.GET_BARCODE_SIZE_FAIL: {
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

export default BoxReducer;
