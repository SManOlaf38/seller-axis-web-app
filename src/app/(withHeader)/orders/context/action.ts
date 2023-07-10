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

export const getOrderDetailRequest = () => ({
  type: constants.GET_ORDER_DETAIL_REQUEST
});
export const getOrderDetailSuccess = (payload: Order) => ({
  type: constants.GET_ORDER_DETAIL_SUCCESS,
  payload
});
export const getOrderDetailFailure = (payload: any) => ({
  type: constants.GET_ORDER_DETAIL_FAIL,
  payload
});
