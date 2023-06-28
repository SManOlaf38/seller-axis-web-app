import * as action from './constant'

export const getWarehouseRequest = () => ({
  type: action.GET_WAREHOUSE_REQUEST,
})

export const getWarehouseSuccess = (payload: string) => ({
  type: action.GET_WAREHOUSE_SUCCESS,
  payload
})

export const getWarehouseFail = (payload: string) => ({
  type: action.GET_WAREHOUSE_FAIL,
  payload
})

export const createWarehouseRequest = () => ({
  type: action.CREATE_WAREHOUSE_REQUEST,
})

export const createWarehouseSuccess = (payload: string) => ({
  type: action.CREATE_WAREHOUSE_SUCCESS,
  payload
})

export const createWarehouseFail = (payload: string) => ({
  type: action.CREATE_WAREHOUSE_FAIL,
  payload
})

export const deleteWarehouseRequest = () => ({
  type: action.DELETE_WAREHOUSE_REQUEST,
})

export const deleteWarehouseSuccess = (payload: number) => ({
  type: action.DELETE_WAREHOUSE_SUCCESS,
  payload
})

export const deleteWarehouseFail = (payload: string) => ({
  type: action.DELETE_WAREHOUSE_FAIL,
  payload
})

export const updateWarehouseRequest = () => ({
  type: action.UPDATE_WAREHOUSE_REQUEST,
})

export const updateWarehouseSuccess = (payload: string) => ({
  type: action.UPDATE_WAREHOUSE_SUCCESS,
  payload
})

export const updateWarehouseFail = (payload: string) => ({
  type: action.UPDATE_WAREHOUSE_FAIL,
  payload
})