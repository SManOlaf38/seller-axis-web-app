import { Order } from '../../orders/interface';
import { ShipmentsStateType } from '../interface';
import * as constants from './constant';

export const initialState: ShipmentsStateType = {
  listOrder: {
    count: 0,
    next: null,
    previous: null,
    results: []
  },
  listOrderReturn: {
    count: 0,
    next: null,
    previous: null,
    results: []
  },
  isLoadingListOrder: false,
  isLoadMoreListOrder: false,
  isLoadingOrderReturn: false
};

function ShipmentsReducer(
  state: ShipmentsStateType,
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case constants.GET_LIST_ORDER_REQUEST: {
      return {
        ...state,
        isLoadingListOrder: true
      };
    }
    case constants.GET_LIST_ORDER_SUCCESS: {
      return {
        ...state,
        isLoadingListOrder: false,
        listOrder: action.payload
      };
    }
    case constants.GET_LIST_ORDER_FAIL: {
      return {
        ...state,
        isLoadingListOrder: false
      };
    }

    case constants.LOAD_MORE_LIST_ORDER_REQUEST: {
      return {
        ...state,
        isLoadMoreListOrder: true
      };
    }
    case constants.LOAD_MORE_LIST_ORDER_SUCCESS: {
      const newData = action.payload?.results;
      const updatedResults = [
        ...state?.listOrder?.results,
        ...newData?.filter(
          (newItem: Order) =>
            !state?.listOrder?.results?.some((item: Order) => item?.id === newItem?.id)
        )
      ];
      return {
        ...state,
        isLoadMoreListOrder: false,
        listOrder: {
          ...state.listOrder,
          next: action.payload.next,
          results: updatedResults
        }
      };
    }
    case constants.LOAD_MORE_LIST_ORDER_FAIL: {
      return {
        ...state,
        isLoadMoreListOrder: false
      };
    }

    case constants.GET_LIST_ORDER_RETURN_REQUEST: {
      return {
        ...state,
        isLoadingOrderReturn: true
      };
    }
    case constants.GET_LIST_ORDER_RETURN_SUCCESS: {
      return {
        ...state,
        isLoadingOrderReturn: false,
        listOrderReturn: action.payload
      };
    }
    case constants.GET_LIST_ORDER_RETURN_FAIL: {
      return {
        ...state,
        isLoadingOrderReturn: false
      };
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default ShipmentsReducer;
