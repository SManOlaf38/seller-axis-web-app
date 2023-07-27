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

export const createInvoiceQuickBookShipRequest = () => ({
  type: constants.CREATE_INVOICE_QUICK_BOOK_REQUEST
});
export const createInvoiceQuickBookShipSuccess = (payload: object) => ({
  type: constants.CREATE_INVOICE_QUICK_BOOK_SUCCESS,
  payload
});
export const createInvoiceQuickBookShipFailure = (payload: any) => ({
  type: constants.CREATE_INVOICE_QUICK_BOOK_FAIL,
  payload
});

export const createInvoiceRequest = () => ({
  type: constants.CREATE_INVOICE_REQUEST
});
export const createInvoiceSuccess = (payload: object) => ({
  type: constants.CREATE_INVOICE_SUCCESS,
  payload
});
export const createInvoiceFailure = (payload: any) => ({
  type: constants.CREATE_INVOICE_FAIL,
  payload
});

export const cancelOrderRequest = () => ({
  type: constants.CANCEL_ORDER_REQUEST
});
export const cancelOrderSuccess = (payload: object) => ({
  type: constants.CANCEL_ORDER_SUCCESS,
  payload
});
export const cancelOrderFailure = (payload: any) => ({
  type: constants.CANCEL_ORDER_FAIL,
  payload
});

export const getCountNewOrderRequest = () => ({
  type: constants.GET_COUNT_NEW_ORDER_REQUEST
});
export const getCountNewOrderSuccess = (payload: object) => ({
  type: constants.GET_COUNT_NEW_ORDER_SUCCESS,
  payload
});
export const getCountNewOrderFailure = (payload: any) => ({
  type: constants.GET_COUNT_NEW_ORDER_FAIL,
  payload
});

export const getNewOrderRequest = () => ({
  type: constants.GET_NEW_ORDER_REQUEST
});
export const getNewOrderSuccess = (payload: object) => ({
  type: constants.GET_NEW_ORDER_SUCCESS,
  payload
});
export const getNewOrderFailure = (payload: any) => ({
  type: constants.GET_NEW_ORDER_FAIL,
  payload
});
export const createAcknowledgeRequest = () => ({
  type: constants.CREATE_ACKNOWLEDGE_REQUEST
});
export const createAcknowledgeSuccess = () => ({
  type: constants.CREATE_ACKNOWLEDGE_SUCCESS
});
export const createAcknowledgeFailure = (payload: any) => ({
  type: constants.CREATE_ACKNOWLEDGE_FAIL,
  payload
});

export const deleteOrderPackageRequest = () => ({
  type: constants.DELETE_ORDER_PACKAGE_REQUEST
});
export const deleteOrderPackageSuccess = () => ({
  type: constants.DELETE_ORDER_PACKAGE_SUCCESS
});
export const deleteOrderPackageFailure = (payload: string) => ({
  type: constants.DELETE_ORDER_PACKAGE_FAIL,
  payload
});
