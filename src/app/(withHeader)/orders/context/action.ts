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

export const getPackageDivideRequest = () => ({
  type: constants.GET_PACKAGE_DIVIDE_REQUEST
});
export const getPackageDivideSuccess = (payload: object) => ({
  type: constants.GET_PACKAGE_DIVIDE_SUCCESS,
  payload
});
export const getPackageDivideFailure = (payload: any) => ({
  type: constants.GET_PACKAGE_DIVIDE_FAIL,
  payload
});

export const createManualShipRequest = () => ({
  type: constants.CREATE_MANUAL_SHIP_REQUEST
});
export const createManualShipSuccess = (payload: object) => ({
  type: constants.CREATE_MANUAL_SHIP_SUCCESS,
  payload
});
export const createManualShipFailure = (payload: any) => ({
  type: constants.CREATE_MANUAL_SHIP_FAIL,
  payload
});

export const setOrderDetail = (payload: Order) => ({
  type: constants.SET_ORDER_DETAIL,
  payload
});
