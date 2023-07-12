import type { RetailerWarehouse } from '../interface';
import * as constants from './constant';

export const getRetailerWarehouseRequest = () => ({
  type: constants.GET_RETAILER_WAREHOUSE_REQUEST
});
export const getRetailerWarehouseSuccess = (payload: any) => ({
  type: constants.GET_RETAILER_WAREHOUSE_SUCCESS,
  payload
});
export const getRetailerWarehouseFailure = (payload: any) => ({
  type: constants.GET_RETAILER_WAREHOUSE_FAIL,
  payload
});

export const getRetailerWarehouseDetailRequest = () => ({
  type: constants.GET_RETAILER_WAREHOUSE_DETAIL_REQUEST
});
export const getRetailerWarehouseDetailSuccess = (payload: RetailerWarehouse) => ({
  type: constants.GET_RETAILER_WAREHOUSE_DETAIL_SUCCESS,
  payload
});
export const getRetailerWarehouseDetailFailure = (payload: any) => ({
  type: constants.GET_RETAILER_WAREHOUSE_DETAIL_FAIL,
  payload
});

export const deleteRetailerWarehouseRequest = () => ({
  type: constants.DELETE_RETAILER_WAREHOUSE_REQUEST
});
export const deleteRetailerWarehouseSuccess = (payload: number) => ({
  type: constants.DELETE_RETAILER_WAREHOUSE_SUCCESS,
  payload
});
export const deleteRetailerWarehouseFailure = (payload: any) => ({
  type: constants.DELETE_RETAILER_WAREHOUSE_FAIL,
  payload
});

export const createRetailerWarehouseRequest = () => ({
  type: constants.CREATE_RETAILER_WAREHOUSE_REQUEST
});
export const createRetailerWarehouseSuccess = () => ({
  type: constants.CREATE_RETAILER_WAREHOUSE_SUCCESS
});
export const createRetailerWarehouseFailure = (payload: any) => ({
  type: constants.CREATE_RETAILER_WAREHOUSE_FAIL,
  payload
});

export const updateRetailerWarehouseRequest = () => ({
  type: constants.UPDATE_RETAILER_WAREHOUSE_REQUEST
});
export const updateRetailerWarehouseSuccess = () => ({
  type: constants.UPDATE_RETAILER_WAREHOUSE_SUCCESS
});
export const updateRetailerWarehouseFailure = (payload: any) => ({
  type: constants.UPDATE_RETAILER_WAREHOUSE_FAIL,
  payload
});
