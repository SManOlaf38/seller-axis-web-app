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
    product: {
      id: '',
      sku: '',
      unit_of_measure: '',
      available: '',
      upc: '',
      description: '',
      unit_cost: 0,
      qty_on_hand: 0,
      qty_reserve: 0,
      image: '',
      created_at: '',
      update_at: '',
      organization: '',
      package_rule: {
        id: '',
        name: '',
        created_at: '',
        updated_at: '',
        organization: ''
      }
    },
    retailer: {
      created_at: '',
      id: '',
      name: '',
      organization: '',
      type: '',
      updated_at: ''
    },
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
