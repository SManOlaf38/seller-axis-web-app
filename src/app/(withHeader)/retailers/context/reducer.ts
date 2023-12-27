import { Retailer, RetailerType } from '../interface';
import * as constants from './constant';

export const initialState: RetailerType = {
  dataRetailer: {
    count: 0,
    next: null,
    previous: null,
    results: []
  },
  detailRetailer: {},
  dataShipRefType: {
    count: 0,
    next: null,
    previous: null,
    results: []
  },
  isLoading: false,
  isLoadingCreate: false,
  isLoadMoreRetailer: false,
  isLoadingDeleteBulk: false,
  isLoadingReloadQB: false,
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

    case constants.LOAD_MORE_RETAILER_REQUEST: {
      return {
        ...state,
        isLoadMoreRetailer: true
      };
    }
    case constants.LOAD_MORE_RETAILER_SUCCESS: {
      const newData = action.payload?.results;
      const updatedResults = [
        ...state?.dataRetailer?.results,
        ...newData?.filter(
          (newRetailer: Retailer) =>
            !state?.dataRetailer?.results?.some(
              (retailer: Retailer) => retailer?.id === newRetailer?.id
            )
        )
      ];
      return {
        ...state,
        isLoadMoreRetailer: false,
        dataRetailer: {
          ...state.dataRetailer,
          next: action.payload.next,
          results: updatedResults
        }
      };
    }
    case constants.LOAD_MORE_RETAILER_FAIL: {
      return {
        ...state,
        isLoadMoreRetailer: false
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

    case constants.GET_SHIP_REF_TYPE_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_SHIP_REF_TYPE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataShipRefType: action.payload
      };
    }
    case constants.GET_SHIP_REF_TYPE_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.DELETE_BULK_RETAILERS_REQUEST: {
      return {
        ...state,
        isLoadingDeleteBulk: true
      };
    }
    case constants.DELETE_BULK_RETAILERS_SUCCESS:
    case constants.DELETE_BULK_RETAILERS_FAIL: {
      return {
        ...state,
        isLoadingDeleteBulk: false
      };
    }

    case constants.GET_RELOAD_QB_REQUEST: {
      return {
        ...state,
        isLoadingReloadQB: true
      };
    }
    case constants.GET_RELOAD_QB_SUCCESS: {
      return {
        ...state,
        isLoadingReloadQB: false
      };
    }
    case constants.GET_RELOAD_QB_FAIL: {
      return {
        ...state,
        isLoadingReloadQB: false
      };
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default RetailerReducer;
