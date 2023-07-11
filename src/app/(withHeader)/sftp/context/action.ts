import type { SFTP, RetailerType } from '../interface';
import * as constants from './constant';

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

export const getSFTPDetailRequest = () => ({
  type: constants.GET_SFTP_DETAIL_REQUEST
});
export const getSFTPDetailSuccess = (payload: SFTP) => ({
  type: constants.GET_SFTP_DETAIL_SUCCESS,
  payload
});
export const getSFTPDetailFailure = (payload: any) => ({
  type: constants.GET_SFTP_DETAIL_FAIL,
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

export const deleteSFTPRequest = () => ({
  type: constants.DELETE_SFTP_REQUEST
});
export const deleteSFTPSuccess = (payload: number) => ({
  type: constants.DELETE_SFTP_SUCCESS,
  payload
});
export const deleteSFTPFailure = (payload: any) => ({
  type: constants.DELETE_SFTP_FAIL,
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

export const downloadOrderRequest = () => ({
  type: constants.DOWNLOAD_ORDER_REQUEST
});
export const downloadOrderSuccess = (payload: any) => ({
  type: constants.DOWNLOAD_ORDER_SUCCESS,
  payload
});
export const downloadOrderFailure = (payload: any) => ({
  type: constants.DOWNLOAD_ORDER_FAIL,
  payload
});
