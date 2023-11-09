import type { RetailerCarrierStateType } from '../interface';
import * as constants from './constant';

export const initialState: RetailerCarrierStateType = {
  dataRetailerCarrier: {
    count: 0,
    next: '',
    previous: '',
    results: []
  },
  isLoading: false,
  isLoadingUpdate: false,
  isLoadingBulkDelete: false,
  error: '',
  dataRetailerCarrierDetail: {
    client_id: '',
    client_secret: '',
    created_at: '',
    id: '',
    updated_at: '',
    account_number: '',
    retailer: {
      created_at: '',
      id: '',
      name: '',
      organization: '',
      type: '',
      updated_at: '',
      merchant_id: ''
    },
    service: {
      created_at: '',
      general_client_id: '',
      general_client_secret: '',
      id: '',
      name: '',
      type: '',
      updated_at: ''
    },
    shipper: {
      name: '',
      attention_name: '',
      tax_identification_number: '',
      phone: '',
      email: '',
      shipper_number: '',
      fax_number: '',
      address: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
      company: ''
    }
  },
  dataServices: []
};

function RetailerCarrierReducer(
  state: RetailerCarrierStateType,
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case constants.GET_RETAILER_CARRIER_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_RETAILER_CARRIER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataRetailerCarrier: action.payload
      };
    }
    case constants.GET_RETAILER_CARRIER_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.GET_SERVICE_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_SERVICE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataServices: action.payload
      };
    }
    case constants.GET_SERVICE_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.GET_RETAILER_CARRIER_DETAIL_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_RETAILER_CARRIER_DETAIL_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataRetailerCarrierDetail: action.payload
      };
    }
    case constants.GET_RETAILER_CARRIER_DETAIL_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.CREATE_RETAILER_CARRIER_REQUEST: {
      return {
        ...state,
        isLoading: true,
        error: ''
      };
    }
    case constants.CREATE_RETAILER_CARRIER_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.CREATE_RETAILER_CARRIER_FAIL: {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    }

    case constants.UPDATE_RETAILER_CARRIER_REQUEST: {
      return {
        ...state,
        isLoadingUpdate: true,
        error: ''
      };
    }
    case constants.UPDATE_RETAILER_CARRIER_SUCCESS: {
      return {
        ...state,
        isLoadingUpdate: false
      };
    }
    case constants.UPDATE_RETAILER_CARRIER_FAIL: {
      return {
        ...state,
        isLoadingUpdate: false,
        error: action.payload
      };
    }

    case constants.DELETE_RETAILER_CARRIER_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.DELETE_RETAILER_CARRIER_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.DELETE_RETAILER_CARRIER_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.DELETE_BULK_RETAILER_CARRIER_REQUEST: {
      return {
        ...state,
        isLoadingBulkDelete: true
      };
    }
    case constants.DELETE_BULK_RETAILER_CARRIER_SUCCESS:
    case constants.DELETE_BULK_RETAILER_CARRIER_FAIL: {
      return {
        ...state,
        isLoadingBulkDelete: false
      };
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default RetailerCarrierReducer;
