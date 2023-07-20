import { BarcodeSizeStateType } from '../interface';
import * as constants from './constant';

export const initialState: BarcodeSizeStateType = {
  isLoading: false,
  isLoadingCreate: false,
  errorMessage: '',
  dataBarcodeSize: {
    count: 0,
    next: '',
    previous: '',
    results: []
  },
  detailBarcodeSize: {}
};

function BarcodeSizeReducer(
  state: BarcodeSizeStateType,
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case constants.CREATE_BARCODE_SIZE_REQUEST: {
      return {
        ...state,
        isLoadingCreate: true,
        errorMessage: ''
      };
    }
    case constants.CREATE_BARCODE_SIZE_SUCCESS: {
      return {
        ...state,
        isLoadingCreate: false
      };
    }
    case constants.CREATE_BARCODE_SIZE_FAIL: {
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
        dataBarcodeSize: action.payload
      };
    }
    case constants.GET_BARCODE_SIZE_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.DELETE_BARCODE_SIZE_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.DELETE_BARCODE_SIZE_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.DELETE_BARCODE_SIZE_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.GET_DETAIL_BARCODE_SIZE_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_DETAIL_BARCODE_SIZE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        detailBarcodeSize: action.payload
      };
    }
    case constants.GET_DETAIL_BARCODE_SIZE_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.UPDATE_BARCODE_SIZE_REQUEST: {
      return {
        ...state,
        isLoadingCreate: true,
        errorMessage: ''
      };
    }
    case constants.UPDATE_BARCODE_SIZE_SUCCESS: {
      return {
        ...state,
        isLoadingCreate: false
      };
    }
    case constants.UPDATE_BARCODE_SIZE_FAIL: {
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
