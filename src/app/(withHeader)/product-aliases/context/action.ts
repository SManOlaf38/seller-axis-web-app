import { RetailerType } from '../interface';
import * as constants from './constant';

export const getProductAliasRequest = () => ({
  type: constants.GET_PRODUCT_ALIAS_REQUEST
});
export const getProductAliasSuccess = (payload: any) => ({
  type: constants.GET_PRODUCT_ALIAS_SUCCESS,
  payload
});
export const getProductAliasFailure = (payload: any) => ({
  type: constants.GET_PRODUCT_ALIAS_FAIL,
  payload
});

export const getRetailerRequest = () => ({
  type: constants.GET_RETAILER_REQUEST
});
export const getRetailerSuccess = (payload: RetailerType[]) => ({
  type: constants.GET_RETAILER_SUCCESS,
  payload
});
export const getRetailerFailure = (payload: any) => ({
  type: constants.GET_RETAILER_FAIL,
  payload
});

export const deleteProductAliasRequest = () => ({
  type: constants.DELETE_PRODUCT_ALIAS_REQUEST
});
export const deleteProductAliasSuccess = (payload: number) => ({
  type: constants.DELETE_PRODUCT_ALIAS_SUCCESS,
  payload
});
export const deleteProductAliasFailure = (payload: any) => ({
  type: constants.DELETE_PRODUCT_ALIAS_FAIL,
  payload
});

export const createProductAliasRequest = () => ({
  type: constants.CREATE_PRODUCT_ALIAS_REQUEST
});
export const createProductAliasSuccess = () => ({
  type: constants.CREATE_PRODUCT_ALIAS_SUCCESS
});
export const createProductAliasFailure = (payload: any) => ({
  type: constants.CREATE_PRODUCT_ALIAS_FAIL,
  payload
});
