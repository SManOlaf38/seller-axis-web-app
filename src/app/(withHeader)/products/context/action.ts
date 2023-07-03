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

export const deleteProductRequest = () => ({
  type: constants.DELETE_PRODUCT_REQUEST
});
export const deleteProductSuccess = (payload: number) => ({
  type: constants.DELETE_PRODUCT_SUCCESS,
  payload
});
export const deleteProductFailure = (payload: any) => ({
  type: constants.DELETE_PRODUCT_FAIL,
  payload
});
