import { Retailer } from '../interface';
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
