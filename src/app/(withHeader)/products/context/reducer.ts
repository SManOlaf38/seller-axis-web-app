import * as constants from './constant';
import { StateType } from './type';

export const initialState: StateType = {
  dataProduct: {
    count: 0,
    next: '',
    previous: '',
    results: []
  },
  loading: true,
  error: ''
};

function ProductReducer(
  state: StateType,
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
        dataWarehouse: action.payload
      };
    }
    case constants.GET_PRODUCT_FAIL: {
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

export default ProductReducer;
