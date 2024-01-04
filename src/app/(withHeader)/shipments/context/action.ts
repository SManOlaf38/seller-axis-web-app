import type { Order } from '../../orders/interface';
import * as constants from './constant';

export const getListOrderRequest = () => ({
  type: constants.GET_LIST_ORDER_REQUEST
});
export const getListOrderSuccess = (payload: Order) => ({
  type: constants.GET_LIST_ORDER_SUCCESS,
  payload
});
export const getListOrderFailure = () => ({
  type: constants.GET_LIST_ORDER_FAIL
});

export const getLoadMoreListOrderRequest = () => ({
  type: constants.LOAD_MORE_LIST_ORDER_REQUEST
});
export const getLoadMoreListOrderSuccess = (payload: Order) => ({
  type: constants.LOAD_MORE_LIST_ORDER_SUCCESS,
  payload
});
export const getLoadMoreListOrderFailure = () => ({
  type: constants.LOAD_MORE_LIST_ORDER_FAIL
});

export const getListOrderReturnRequest = () => ({
  type: constants.GET_LIST_ORDER_RETURN_REQUEST
});
export const getListOrderReturnSuccess = (payload: Order) => ({
  type: constants.GET_LIST_ORDER_RETURN_SUCCESS,
  payload
});
export const getListOrderReturnFailure = () => ({
  type: constants.GET_LIST_ORDER_RETURN_FAIL
});
