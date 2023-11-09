import { BarcodeSize } from '../interface';
import * as constants from './constant';

export const getBarcodeSizeRequest = () => ({
  type: constants.GET_BARCODE_SIZE_REQUEST
});
export const getBarcodeSizeSuccess = (payload: BarcodeSize) => ({
  type: constants.GET_BARCODE_SIZE_SUCCESS,
  payload
});
export const getBarcodeSizeFailure = (payload: string) => ({
  type: constants.GET_BARCODE_SIZE_FAIL,
  payload
});
export const createBarcodeSizeRequest = () => ({
  type: constants.CREATE_BARCODE_SIZE_REQUEST
});
export const createBarcodeSizeSuccess = () => ({
  type: constants.CREATE_BARCODE_SIZE_SUCCESS
});
export const createBarcodeSizeFailure = (payload: string) => ({
  type: constants.CREATE_BARCODE_SIZE_FAIL,
  payload
});

export const deleteBarcodeSizeRequest = () => ({
  type: constants.DELETE_BARCODE_SIZE_REQUEST
});
export const deleteBarcodeSizeSuccess = (payload: number) => ({
  type: constants.DELETE_BARCODE_SIZE_SUCCESS,
  payload
});
export const deleteBarcodeSizeFailure = (payload: string) => ({
  type: constants.DELETE_BARCODE_SIZE_FAIL,
  payload
});

export const getDetailBarcodeSizeRequest = () => ({
  type: constants.GET_DETAIL_BARCODE_SIZE_REQUEST
});
export const getDetailBarcodeSizeSuccess = (payload: BarcodeSize) => ({
  type: constants.GET_DETAIL_BARCODE_SIZE_SUCCESS,
  payload
});
export const getDetailBarcodeSizeFailure = (payload: string) => ({
  type: constants.GET_DETAIL_BARCODE_SIZE_FAIL,
  payload
});

export const updateBarcodeSizeRequest = () => ({
  type: constants.UPDATE_BARCODE_SIZE_REQUEST
});
export const updateBarcodeSizeSuccess = () => ({
  type: constants.UPDATE_BARCODE_SIZE_SUCCESS
});
export const updateBarcodeSizeFailure = (payload: string) => ({
  type: constants.UPDATE_BARCODE_SIZE_FAIL,
  payload
});

export const deleteBulkBarcodeSizeRequest = () => ({
  type: constants.DELETE_BULK_BARCODE_SIZE_REQUEST
});
export const deleteBulkBarcodeSizeSuccess = () => ({
  type: constants.DELETE_BULK_BARCODE_SIZE_SUCCESS
});
export const deleteBulkBarcodeSizeFailure = () => ({
  type: constants.DELETE_BULK_BARCODE_SIZE_FAIL
});
