import type { ProductSeriesStateType } from '../interface';
import * as constants from './constant';

export const initialState: ProductSeriesStateType = {
  dataProductSeries: {
    count: 0,
    next: '',
    previous: '',
    results: []
  },
  isLoading: false,
  error: '',
  dataProductSeriesDetail: {
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
      qty_pending: 0,
      image: '',
      created_at: '',
      update_at: '',
      organization: ''
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

function ProductSeriesReducer(
  state: ProductSeriesStateType,
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case constants.GET_PRODUCT_SERIES_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_PRODUCT_SERIES_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataProductSeries: action.payload
      };
    }
    case constants.GET_PRODUCT_SERIES_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.GET_PRODUCT_SERIES_DETAIL_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_PRODUCT_SERIES_DETAIL_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataProductSeriesDetail: action.payload
      };
    }
    case constants.GET_PRODUCT_SERIES_DETAIL_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.CREATE_PRODUCT_SERIES_REQUEST: {
      return {
        ...state,
        isLoading: true,
        error: ''
      };
    }
    case constants.CREATE_PRODUCT_SERIES_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.CREATE_PRODUCT_SERIES_FAIL: {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    }

    case constants.UPDATE_PRODUCT_SERIES_REQUEST: {
      return {
        ...state,
        isLoading: true,
        error: ''
      };
    }
    case constants.UPDATE_PRODUCT_SERIES_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.UPDATE_PRODUCT_SERIES_FAIL: {
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
    }

    case constants.DELETE_PRODUCT_SERIES_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.DELETE_PRODUCT_SERIES_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.DELETE_PRODUCT_SERIES_FAIL: {
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

export default ProductSeriesReducer;
