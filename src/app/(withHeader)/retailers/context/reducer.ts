import { RetailerType } from '../interface';
import * as constants from './constant';

export const initialState: RetailerType = {
  dataRetailer: {
    count: 0,
    next: '',
    previous: '',
    results: []
  },
  detailRetailer: {},
  isLoading: false,
  isLoadingCreate: false,
  errorMessage: '',
  dataSFTP: {
    count: 0,
    next: '',
    previous: '',
    results: []
  }
};

function RetailerReducer(
  state: RetailerType,
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case constants.GET_RETAILER_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_RETAILER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataRetailer: action.payload
      };
    }
    case constants.GET_RETAILER_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.CREATE_RETAILER_REQUEST: {
      return {
        ...state,
        isLoadingCreate: true,
        errorMessage: ''
      };
    }
    case constants.CREATE_RETAILER_SUCCESS: {
      return {
        ...state,
        isLoadingCreate: false
      };
    }
    case constants.CREATE_RETAILER_FAIL: {
      return {
        ...state,
        isLoadingCreate: false,
        errorMessage: action.payload
      };
    }

    case constants.CREATE_SFTP_REQUEST: {
      return {
        ...state,
        isLoadingCreate: true
      };
    }
    case constants.CREATE_SFTP_SUCCESS: {
      return {
        ...state,
        isLoadingCreate: false
      };
    }
    case constants.CREATE_SFTP_FAIL: {
      return {
        ...state,
        isLoadingCreate: false,
        errorMessage: action.payload.message
      };
    }

    case constants.UPDATE_RETAILER_REQUEST: {
      return {
        ...state,
        isLoadingCreate: true,
        errorMessage: ''
      };
    }
    case constants.UPDATE_RETAILER_SUCCESS: {
      return {
        ...state,
        isLoadingCreate: false
      };
    }
    case constants.UPDATE_RETAILER_FAIL: {
      return {
        ...state,
        isLoadingCreate: false,
        errorMessage: action.payload
      };
    }

    case constants.DELETE_RETAILER_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.DELETE_RETAILER_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.DELETE_RETAILER_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.GET_DETAIL_RETAILER_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_DETAIL_RETAILER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        detailRetailer: action.payload
      };
    }
    case constants.GET_DETAIL_RETAILER_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.GET_SFTP_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_SFTP_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataSFTP: action.payload
      };
    }
    case constants.GET_SFTP_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.UPDATE_SFTP_REQUEST: {
      return {
        ...state,
        isLoadingCreate: true
      };
    }
    case constants.UPDATE_SFTP_SUCCESS: {
      return {
        ...state,
        isLoadingCreate: false
      };
    }
    case constants.UPDATE_SFTP_FAIL: {
      return {
        ...state,
        isLoadingCreate: false,
        errorMessage: action.payload.message
      };
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default RetailerReducer;
