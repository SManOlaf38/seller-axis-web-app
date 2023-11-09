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
  isLoadingDeleteBulk: false,
  error: '',
  dataProductSeriesDetail: {
    id: '',
    created_at: '',
    series: '',
    updated_at: '',
    package_rules: []
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

    case constants.DELETE_BULK_PRODUCT_SERIES_REQUEST: {
      return {
        ...state,
        isLoadingDeleteBulk: true
      };
    }
    case constants.DELETE_BULK_PRODUCT_SERIES_SUCCESS:
    case constants.DELETE_BULK_PRODUCT_SERIES_FAIL: {
      return {
        ...state,
        isLoadingDeleteBulk: false
      };
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default ProductSeriesReducer;
