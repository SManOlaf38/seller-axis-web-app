import type { Order } from '../interface';
import * as constants from './constant';

export const getOrderRequest = () => ({
  type: constants.GET_ORDER_REQUEST
});
export const getOrderSuccess = (payload: object) => ({
  type: constants.GET_ORDER_SUCCESS,
  payload
});
export const getOrderFailure = (payload: any) => ({
  type: constants.GET_ORDER_FAIL,
  payload
});

export const setOrderDetail = (payload: Order) => ({
  type: constants.SET_ORDER_DETAIL,
  payload
});
