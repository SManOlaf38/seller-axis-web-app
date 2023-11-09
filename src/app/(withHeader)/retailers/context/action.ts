import { PayloadShipRefType, Retailer } from '../interface';
import * as constants from './constant';

export const getRetailerRequest = () => ({
  type: constants.GET_RETAILER_REQUEST
});
export const getRetailerSuccess = (payload: Retailer) => ({
  type: constants.GET_RETAILER_SUCCESS,
  payload
});
export const getRetailerFailure = (payload: string) => ({
  type: constants.GET_RETAILER_FAIL,
  payload
});

export const getLoadMoreRetailerRequest = () => ({
  type: constants.LOAD_MORE_RETAILER_REQUEST
});
export const getLoadMoreRetailerSuccess = (payload: Retailer) => ({
  type: constants.LOAD_MORE_RETAILER_SUCCESS,
  payload
});
export const getLoadMoreRetailerFailure = (payload: string) => ({
  type: constants.LOAD_MORE_RETAILER_FAIL,
  payload
});

export const deleteRetailerRequest = () => ({
  type: constants.DELETE_RETAILER_REQUEST
});
export const deleteRetailerSuccess = (payload: number) => ({
  type: constants.DELETE_RETAILER_SUCCESS,
  payload
});
export const deleteRetailerFailure = (payload: string) => ({
  type: constants.DELETE_RETAILER_FAIL,
  payload
});

export const deleteBulkRetailersRequest = () => ({
  type: constants.DELETE_BULK_RETAILERS_REQUEST
});
export const deleteBulkRetailersSuccess = () => ({
  type: constants.DELETE_BULK_RETAILERS_SUCCESS
});
export const deleteBulkRetailersFailure = () => ({
  type: constants.DELETE_BULK_RETAILERS_FAIL
});

export const createRetailerRequest = () => ({
  type: constants.CREATE_RETAILER_REQUEST
});
export const createRetailerSuccess = () => ({
  type: constants.CREATE_RETAILER_SUCCESS
});
export const createRetailerFailure = (payload: string) => ({
  type: constants.CREATE_RETAILER_FAIL,
  payload
});

export const getDetailRetailerRequest = () => ({
  type: constants.GET_DETAIL_RETAILER_REQUEST
});
export const getDetailRetailerSuccess = (payload: any) => ({
  type: constants.GET_DETAIL_RETAILER_SUCCESS,
  payload
});
export const getDetailRetailerFailure = (payload: string) => ({
  type: constants.GET_DETAIL_RETAILER_FAIL,
  payload
});

export const updateRetailerRequest = () => ({
  type: constants.UPDATE_RETAILER_REQUEST
});
export const updateRetailerSuccess = () => ({
  type: constants.UPDATE_RETAILER_SUCCESS
});
export const updateRetailerFailure = (payload: string) => ({
  type: constants.UPDATE_RETAILER_FAIL,
  payload
});

export const createSFTPRequest = () => ({
  type: constants.CREATE_SFTP_REQUEST
});
export const createSFTPSuccess = () => ({
  type: constants.CREATE_SFTP_SUCCESS
});
export const createSFTPFailure = (payload: any) => ({
  type: constants.CREATE_SFTP_FAIL,
  payload
});

export const getSFTPRequest = () => ({
  type: constants.GET_SFTP_REQUEST
});
export const getSFTPSuccess = (payload: any) => ({
  type: constants.GET_SFTP_SUCCESS,
  payload
});
export const getSFTPFailure = (payload: any) => ({
  type: constants.GET_SFTP_FAIL,
  payload
});

export const updateSFTPRequest = () => ({
  type: constants.UPDATE_SFTP_REQUEST
});
export const updateSFTPSuccess = () => ({
  type: constants.UPDATE_SFTP_SUCCESS
});
export const updateSFTPFailure = (payload: any) => ({
  type: constants.UPDATE_SFTP_FAIL,
  payload
});

export const getShipRefTypeRequest = () => ({
  type: constants.GET_SHIP_REF_TYPE_REQUEST
});
export const getShipRefTypeSuccess = (payload: PayloadShipRefType) => ({
  type: constants.GET_SHIP_REF_TYPE_SUCCESS,
  payload
});
export const getShipRefTypeFailure = (payload: string) => ({
  type: constants.GET_SHIP_REF_TYPE_FAIL,
  payload
});
