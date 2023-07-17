import * as constants from './constant';

export const openAlertMessage = (payload: any) => ({
  type: constants.OPEN_ALERT,
  payload
});
export const closeAlertMessage = () => ({
  type: constants.CLOSE_ALERT
});
