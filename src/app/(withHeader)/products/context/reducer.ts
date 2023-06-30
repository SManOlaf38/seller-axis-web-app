import * as constants from './constant';
import { ProductStateType } from './type';

export const initialState: ProductStateType = {
  dataProduct: {
    count: 0,
    next: '',
    previous: '',
    results: [],
  },
  isLoading: true,
  error: ''
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
        dataProduct: {
          ...state.dataProduct,
          results: action.payload
        }
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
