import type { ProductSeries } from '../interface';
import * as constants from './constant';

export const getProductSeriesRequest = () => ({
  type: constants.GET_PRODUCT_SERIES_REQUEST
});
export const getProductSeriesSuccess = (payload: any) => ({
  type: constants.GET_PRODUCT_SERIES_SUCCESS,
  payload
});
export const getProductSeriesFailure = (payload: any) => ({
  type: constants.GET_PRODUCT_SERIES_FAIL,
  payload
});

export const getProductSeriesDetailRequest = () => ({
  type: constants.GET_PRODUCT_SERIES_DETAIL_REQUEST
});
export const getProductSeriesDetailSuccess = (payload: ProductSeries) => ({
  type: constants.GET_PRODUCT_SERIES_DETAIL_SUCCESS,
  payload
});
export const getProductSeriesDetailFailure = (payload: any) => ({
  type: constants.GET_PRODUCT_SERIES_DETAIL_FAIL,
  payload
});

export const deleteProductSeriesRequest = () => ({
  type: constants.DELETE_PRODUCT_SERIES_REQUEST
});
export const deleteProductSeriesSuccess = (payload: number) => ({
  type: constants.DELETE_PRODUCT_SERIES_SUCCESS,
  payload
});
export const deleteProductSeriesFailure = (payload: any) => ({
  type: constants.DELETE_PRODUCT_SERIES_FAIL,
  payload
});

export const deleteBulkProductSeriesRequest = () => ({
  type: constants.DELETE_BULK_PRODUCT_SERIES_REQUEST
});
export const deleteBulkProductSeriesSuccess = () => ({
  type: constants.DELETE_BULK_PRODUCT_SERIES_SUCCESS
});
export const deleteBulkProductSeriesFailure = () => ({
  type: constants.DELETE_BULK_PRODUCT_SERIES_FAIL
});

export const createProductSeriesRequest = () => ({
  type: constants.CREATE_PRODUCT_SERIES_REQUEST
});
export const createProductSeriesSuccess = () => ({
  type: constants.CREATE_PRODUCT_SERIES_SUCCESS
});
export const createProductSeriesFailure = (payload: any) => ({
  type: constants.CREATE_PRODUCT_SERIES_FAIL,
  payload
});

export const updateProductSeriesRequest = () => ({
  type: constants.UPDATE_PRODUCT_SERIES_REQUEST
});
export const updateProductSeriesSuccess = () => ({
  type: constants.UPDATE_PRODUCT_SERIES_SUCCESS
});
export const updateProductSeriesFailure = (payload: any) => ({
  type: constants.UPDATE_PRODUCT_SERIES_FAIL,
  payload
});
