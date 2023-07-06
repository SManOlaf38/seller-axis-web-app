import { DataProfileType } from './../interfaces/index';
import * as action from './constant';

export const getProfileRequest = () => ({
  type: action.GET_PROFILE_REQUEST
});

export const getProfileSuccess = (payload: DataProfileType) => ({
  type: action.GET_PROFILE_SUCCESS,
  payload
});

export const getProfileFail = (payload: string) => ({
  type: action.GET_PROFILE_FAIL,
  payload
});
