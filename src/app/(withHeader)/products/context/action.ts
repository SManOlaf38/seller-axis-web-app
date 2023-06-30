import * as constants from './constant';

// get classifications
export const getProductRequest = () => ({
  type: constants.GET_PRODUCT_REQUEST
});
export const getProductSuccess = (payload: any) => ({
  type: constants.GET_PRODUCT_SUCCESS,
  payload
});
export const getProductFailure = (payload: any) => ({
  type: constants.GET_PRODUCT_FAIL,
  payload
});
