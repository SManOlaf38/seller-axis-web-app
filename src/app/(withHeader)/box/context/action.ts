import { BarcodeSize, Box } from '../interface';
import * as constants from './constant';

export const getBoxRequest = () => ({
  type: constants.GET_BOX_REQUEST
});
export const getBoxSuccess = (payload: Box) => ({
  type: constants.GET_BOX_SUCCESS,
  payload
});
export const getBoxFailure = (payload: string) => ({
  type: constants.GET_BOX_FAIL,
  payload
});

export const createBoxRequest = () => ({
  type: constants.CREATE_BOX_REQUEST
});
export const createBoxSuccess = () => ({
  type: constants.CREATE_BOX_SUCCESS
});
export const createBoxFailure = (payload: string) => ({
  type: constants.CREATE_BOX_FAIL,
  payload
});

export const deleteBoxRequest = () => ({
  type: constants.DELETE_BOX_REQUEST
});
export const deleteBoxSuccess = (payload: number) => ({
  type: constants.DELETE_BOX_SUCCESS,
  payload
});
export const deleteBoxFailure = (payload: string) => ({
  type: constants.DELETE_BOX_FAIL,
  payload
});

export const getDetailBoxRequest = () => ({
  type: constants.GET_DETAIL_BOX_REQUEST
});
export const getDetailBoxSuccess = (payload: Box) => ({
  type: constants.GET_DETAIL_BOX_SUCCESS,
  payload
});
export const getDetailBoxFailure = (payload: string) => ({
  type: constants.GET_DETAIL_BOX_FAIL,
  payload
});

export const updateBoxRequest = () => ({
  type: constants.UPDATE_BOX_REQUEST
});
export const updateBoxSuccess = () => ({
  type: constants.UPDATE_BOX_SUCCESS
});
export const updateBoxFailure = (payload: string) => ({
  type: constants.UPDATE_BOX_FAIL,
  payload
});

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

export const deleteBulkBoxRequest = () => ({
  type: constants.DELETE_BULK_BOX_REQUEST
});
export const deleteBulkBoxSuccess = () => ({
  type: constants.DELETE_BULK_BOX_SUCCESS
});
export const deleteBulkBoxFailure = () => ({
  type: constants.DELETE_BULK_BOX_FAIL
});
