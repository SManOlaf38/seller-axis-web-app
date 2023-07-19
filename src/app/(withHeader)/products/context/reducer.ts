import type { ProductStateType } from '../interface';
import * as constants from './constant';

export const initialState: ProductStateType = {
  dataProduct: {
    count: 0,
    next: '',
    previous: '',
    results: []
  },
  isLoading: false,
  error: '',
  packageRules: [],
  productDetail: {
    id: '',
    sku: '',
    unit_of_measure: '',
    available: '',
    upc: '',
    description: '',
    unit_cost: 0,
    qty_on_hand: 0,
    qty_reserve: 0,
    qty_pending: 0,
    image: '',
    created_at: '',
    update_at: '',
    organization: 0
  },
  dataBoxes: []
};

function ProductReducer(
  state: ProductStateType,
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case constants.GET_PRODUCT_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_PRODUCT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataProduct: action.payload
      };
    }
    case constants.GET_PRODUCT_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.CREATE_PRODUCT_REQUEST: {
      return {
        ...state,
        isLoading: true,
        error: ''
      };
    }
    case constants.CREATE_PRODUCT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        error: ''
      };
    }
    case constants.CREATE_PRODUCT_FAIL: {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    }

    case constants.GET_PACKAGE_RULE_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }

    case constants.GET_PACKAGE_RULE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        packageRules: action.payload
      };
    }
    case constants.GET_PACKAGE_RULE_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.GET_PRODUCT_DETAIL_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }

    case constants.GET_PRODUCT_DETAIL_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        productDetail: action.payload
      };
    }
    case constants.GET_PRODUCT_DETAIL_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.DELETE_PRODUCT_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.DELETE_PRODUCT_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.DELETE_PRODUCT_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.UPDATE_PRODUCT_REQUEST: {
      return {
        ...state,
        isLoading: true,
        error: ''
      };
    }
    case constants.UPDATE_PRODUCT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        productDetail: action.payload
      };
    }
    case constants.UPDATE_PRODUCT_FAIL: {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default ProductReducer;
