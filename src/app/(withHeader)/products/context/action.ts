import type { Boxes, PackageRule, Product } from '../interface';
import * as constants from './constant';

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

export const createProductRequest = () => ({
  type: constants.CREATE_PRODUCT_REQUEST
});
export const createProductSuccess = () => ({
  type: constants.CREATE_PRODUCT_SUCCESS
});
export const createProductFailure = (payload: any) => ({
  type: constants.CREATE_PRODUCT_FAIL,
  payload
});

export const updateProductRequest = () => ({
  type: constants.UPDATE_PRODUCT_REQUEST
});
export const updateProductSuccess = (payload: Product) => ({
  type: constants.UPDATE_PRODUCT_SUCCESS,
  payload
});
export const updateProductFailure = (payload: any) => ({
  type: constants.UPDATE_PRODUCT_FAIL,
  payload
});

export const getPackageRuleRequest = () => ({
  type: constants.GET_PACKAGE_RULE_REQUEST
});
export const getPackageRuleSuccess = (payload: PackageRule) => ({
  type: constants.GET_PACKAGE_RULE_SUCCESS,
  payload
});
export const getPackageRuleFailure = (payload: any) => ({
  type: constants.GET_PACKAGE_RULE_FAIL,
  payload
});

export const getProductDetailRequest = () => ({
  type: constants.GET_PRODUCT_DETAIL_REQUEST
});
export const getProductDetailSuccess = (payload: Product) => ({
  type: constants.GET_PRODUCT_DETAIL_SUCCESS,
  payload
});
export const getProductDetailFailure = (payload: any) => ({
  type: constants.GET_PRODUCT_DETAIL_FAIL,
  payload
});