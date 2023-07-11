import type { SFTPStateType } from '../interface';
import * as constants from './constant';

export const initialState: SFTPStateType = {
  dataSFTP: {
    count: 0,
    next: '',
    previous: '',
    results: []
  },
  isLoading: false,
  error: '',
  dataRetailer: [],
  dataSFTPDetail: {
    acknowledgment_sftp_directory: '',
    confirm_sftp_directory: '',
    created_at: '',
    id: '',
    inventory_sftp_directory: '',
    invoice_sftp_directory: '',
    payment_sftp_directory: '',
    purchase_orders_sftp_directory: '',
    retailer: '',
    return_sftp_directory: '',
    sftp_host: '',
    sftp_password: '',
    sftp_username: '',
    updated_at: ''
  }
};

function SFTPReducer(
  state: SFTPStateType,
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
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

    case constants.GET_SFTP_DETAIL_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_SFTP_DETAIL_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataSFTPDetail: action.payload
      };
    }
    case constants.GET_SFTP_DETAIL_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.CREATE_SFTP_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.CREATE_SFTP_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.CREATE_SFTP_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.UPDATE_SFTP_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.UPDATE_SFTP_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.UPDATE_SFTP_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.DELETE_SFTP_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.DELETE_SFTP_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.DELETE_SFTP_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

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

    case constants.DOWNLOAD_ORDER_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.DOWNLOAD_ORDER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case constants.DOWNLOAD_ORDER_FAIL: {
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

export default SFTPReducer;
