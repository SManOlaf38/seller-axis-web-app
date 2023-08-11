import * as constants from './constant';

export const getDailyPickListRequest = () => ({
  type: constants.GET_DAILY_PICK_LIST_REQUEST
});
export const getDailyPickListSuccess = () => ({
  type: constants.GET_DAILY_PICK_LIST_SUCCESS
});
export const getDailyPickListFailure = (payload: string) => ({
  type: constants.GET_DAILY_PICK_LIST_FAIL,
  payload
});
