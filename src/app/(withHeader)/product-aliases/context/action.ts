import type { ProductAlias, RetailerType } from '../interface';
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

export const getProductAliasDetailRequest = () => ({
  type: constants.GET_PRODUCT_ALIAS_DETAIL_REQUEST
});
export const getProductAliasDetailSuccess = (payload: ProductAlias) => ({
  type: constants.GET_PRODUCT_ALIAS_DETAIL_SUCCESS,
  payload
});
export const getProductAliasDetailFailure = (payload: any) => ({
  type: constants.GET_PRODUCT_ALIAS_DETAIL_FAIL,
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

export const updateProductAliasRequest = () => ({
  type: constants.UPDATE_PRODUCT_ALIAS_REQUEST
});
export const updateProductAliasSuccess = () => ({
  type: constants.UPDATE_PRODUCT_ALIAS_SUCCESS
});
export const updateProductAliasFailure = (payload: any) => ({
  type: constants.UPDATE_PRODUCT_ALIAS_FAIL,
  payload
});

export const updateProductStaticBulkRequest = () => ({
  type: constants.UPDATE_PRODUCT_STATIC_BULK_REQUEST
});
export const updateProductStaticBulkSuccess = () => ({
  type: constants.UPDATE_PRODUCT_STATIC_BULK_SUCCESS
});
export const updateProductStaticBulkFailure = (payload: any) => ({
  type: constants.UPDATE_PRODUCT_STATIC_BULK_FAIL,
  payload
});

export const createProductWarehouseRequest = () => ({
  type: constants.CREATE_PRODUCT_WAREHOUSE_REQUEST
});
export const createProductWarehouseSuccess = () => ({
  type: constants.CREATE_PRODUCT_WAREHOUSE_SUCCESS
});
export const createProductWarehouseFailure = () => ({
  type: constants.CREATE_PRODUCT_WAREHOUSE_FAIL
});

export const updateLiveProductAliasRequest = () => ({
  type: constants.UPDATE_LIVE_PRODUCT_ALIAS_REQUEST
});
export const updateLiveProductAliasSuccess = () => ({
  type: constants.UPDATE_LIVE_PRODUCT_ALIAS_SUCCESS
});
export const updateLiveProductAliasFailure = (payload: string) => ({
  type: constants.UPDATE_LIVE_PRODUCT_ALIAS_FAIL,
  payload
});

export const downloadInventoryRequest = () => ({
  type: constants.DOWNLOAD_INVENTORY_REQUEST
});
export const downloadInventorySuccess = () => ({
  type: constants.DOWNLOAD_INVENTORY_SUCCESS
});
export const downloadInventoryFailure = (payload: string) => ({
  type: constants.DOWNLOAD_INVENTORY_FAIL,
  payload
});

export const createBulkProductAliasRequest = () => ({
  type: constants.CREATE_BULK_PRODUCT_ALIAS_REQUEST
});
export const createBulkProductAliasSuccess = () => ({
  type: constants.CREATE_BULK_PRODUCT_ALIAS_SUCCESS
});
export const createBulkProductAliasFailure = (payload: string) => ({
  type: constants.CREATE_BULK_PRODUCT_ALIAS_FAIL,
  payload
});

export const deleteBulkProductAliasRequest = () => ({
  type: constants.DELETE_BULK_PRODUCT_ALIAS_REQUEST
});
export const deleteBulkProductAliasSuccess = () => ({
  type: constants.DELETE_BULK_PRODUCT_ALIAS_SUCCESS
});
export const deleteBulkProductAliasFailure = (payload: string) => ({
  type: constants.DELETE_BULK_PRODUCT_ALIAS_FAIL,
  payload
});
