import type { RetailerCarrier, RetailerType } from '../interface';
import * as constants from './constant';

export const getRetailerCarrierRequest = () => ({
  type: constants.GET_RETAILER_CARRIER_REQUEST
});
export const getRetailerCarrierSuccess = (payload: any) => ({
  type: constants.GET_RETAILER_CARRIER_SUCCESS,
  payload
});
export const getRetailerCarrierFailure = (payload: any) => ({
  type: constants.GET_RETAILER_CARRIER_FAIL,
  payload
});

export const getServiceRequest = () => ({
  type: constants.GET_SERVICE_REQUEST
});
export const getServiceSuccess = (payload: any) => ({
  type: constants.GET_SERVICE_SUCCESS,
  payload
});
export const getServiceFailure = (payload: any) => ({
  type: constants.GET_SERVICE_FAIL,
  payload
});


export const getRetailerCarrierDetailRequest = () => ({
  type: constants.GET_RETAILER_CARRIER_DETAIL_REQUEST
});
export const getRetailerCarrierDetailSuccess = (payload: RetailerCarrier) => ({
  type: constants.GET_RETAILER_CARRIER_DETAIL_SUCCESS,
  payload
});
export const getRetailerCarrierDetailFailure = (payload: any) => ({
  type: constants.GET_RETAILER_CARRIER_DETAIL_FAIL,
  payload
});

export const deleteRetailerCarrierRequest = () => ({
  type: constants.DELETE_RETAILER_CARRIER_REQUEST
});
export const deleteRetailerCarrierSuccess = (payload: number) => ({
  type: constants.DELETE_RETAILER_CARRIER_SUCCESS,
  payload
});
export const deleteRetailerCarrierFailure = (payload: any) => ({
  type: constants.DELETE_RETAILER_CARRIER_FAIL,
  payload
});

export const createRetailerCarrierRequest = () => ({
  type: constants.CREATE_RETAILER_CARRIER_REQUEST
});
export const createRetailerCarrierSuccess = () => ({
  type: constants.CREATE_RETAILER_CARRIER_SUCCESS
});
export const createRetailerCarrierFailure = (payload: any) => ({
  type: constants.CREATE_RETAILER_CARRIER_FAIL,
  payload
});

export const updateRetailerCarrierRequest = () => ({
  type: constants.UPDATE_RETAILER_CARRIER_REQUEST
});
export const updateRetailerCarrierSuccess = () => ({
  type: constants.UPDATE_RETAILER_CARRIER_SUCCESS
});
export const updateRetailerCarrierFailure = (payload: any) => ({
  type: constants.UPDATE_RETAILER_CARRIER_FAIL,
  payload
});
