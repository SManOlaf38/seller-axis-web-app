import * as action from './constant'

export const loginRequest = () => ({
  type: action.LOGIN_REQUEST,
})

export const loginSuccess = (payload: string) => ({
  type: action.LOGIN_SUCCESS,
  payload
})

export const loginFail = (payload: string) => ({
  type: action.LOGIN_FAIL,
  payload
})

export const registerRequest = () => ({
  type: action.REGISTER_REQUEST,
})

export const registerSuccess = (payload: string) => ({
  type: action.REGISTER_SUCCESS,
  payload
})

export const registerFail = (payload: string) => ({
  type: action.REGISTER_FAIL,
  payload
})
