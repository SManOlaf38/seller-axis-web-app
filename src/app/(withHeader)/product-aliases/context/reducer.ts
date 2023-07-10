import type { ProductAliasStateType } from '../interface';
import * as constants from './constant';

export const initialState: ProductAliasStateType = {
  dataProductAlias: {
    count: 0,
    next: '',
    previous: '',
    results: []
  },
  isLoading: false,
  error: '',
  dataRetailer: [],
  dataProductAliasDetail: {
    created_at: '',
    id: '',
    merchant_sku: '',
    product: '',
    retailer: '',
    sku: '',
    vendor_sku: '',
    updated_at: ''
  }
};

function ProductAliasReducer(
  state: ProductAliasStateType,
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case constants.GET_PRODUCT_ALIAS_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_PRODUCT_ALIAS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataProductAlias: action.payload
      };
    }
    case constants.GET_PRODUCT_ALIAS_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.GET_PRODUCT_ALIAS_DETAIL_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_PRODUCT_ALIAS_DETAIL_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataProductAliasDetail: action.payload
      };
    }
    case constants.GET_PRODUCT_ALIAS_DETAIL_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.CREATE_PRODUCT_ALIAS_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.CREATE_PRODUCT_ALIAS_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.CREATE_PRODUCT_ALIAS_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.UPDATE_PRODUCT_ALIAS_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.UPDATE_PRODUCT_ALIAS_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.UPDATE_PRODUCT_ALIAS_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.DELETE_PRODUCT_ALIAS_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.DELETE_PRODUCT_ALIAS_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.DELETE_PRODUCT_ALIAS_FAIL: {
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

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default ProductAliasReducer;
