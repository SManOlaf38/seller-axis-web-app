import * as constants from './constant';

export const getDailyPickListRequest = () => ({
  type: constants.GET_DAILY_PICK_LIST_REQUEST
});
export const getDailyPickListSuccess = (payload: any) => ({
  type: constants.GET_DAILY_PICK_LIST_SUCCESS,
  payload
});
export const getDailyPickListFailure = (payload: string) => ({
  type: constants.GET_DAILY_PICK_LIST_FAIL,
  payload
});
