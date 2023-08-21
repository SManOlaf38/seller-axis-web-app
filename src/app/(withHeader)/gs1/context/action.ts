import { Gs1 } from '../interface';
import * as constants from './constant';

export const getGs1Request = () => ({
  type: constants.GET_GS1_REQUEST
});
export const getGs1Success = (payload: Gs1) => ({
  type: constants.GET_GS1_SUCCESS,
  payload
});
export const getGs1Failure = (payload: string) => ({
  type: constants.GET_GS1_FAIL,
  payload
});
export const createGs1Request = () => ({
  type: constants.CREATE_GS1_REQUEST
});
export const createGs1Success = () => ({
  type: constants.CREATE_GS1_SUCCESS
});
export const createGs1Failure = (payload: string) => ({
  type: constants.CREATE_GS1_FAIL,
  payload
});

export const deleteGs1Request = () => ({
  type: constants.DELETE_GS1_REQUEST
});
export const deleteGs1Success = (payload: number) => ({
  type: constants.DELETE_GS1_SUCCESS,
  payload
});
export const deleteGs1Failure = (payload: string) => ({
  type: constants.DELETE_GS1_FAIL,
  payload
});

export const getDetailGs1Request = () => ({
  type: constants.GET_DETAIL_GS1_REQUEST
});
export const getDetailGs1Success = (payload: Gs1) => ({
  type: constants.GET_DETAIL_GS1_SUCCESS,
  payload
});
export const getDetailGs1Failure = (payload: string) => ({
  type: constants.GET_DETAIL_GS1_FAIL,
  payload
});

export const updateGs1Request = () => ({
  type: constants.UPDATE_GS1_REQUEST
});
export const updateGs1Success = () => ({
  type: constants.UPDATE_GS1_SUCCESS
});
export const updateGs1Failure = (payload: string) => ({
  type: constants.UPDATE_GS1_FAIL,
  payload
});
