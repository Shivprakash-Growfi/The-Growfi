import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  LOGIN_VERIFY_USER,
  API_ERROR,
  SOCIAL_LOGIN,
  LOGIN_USER_OTP,
  LOGIN_RESET,
  SELECT_ORGANISATION,
} from './actionTypes';

export const loginUser = (user, history) => {
  return {
    type: LOGIN_USER,
    payload: { user },
  };
};

export const loginUserOtp = (user, response) => {
  return {
    type: LOGIN_USER_OTP,
    payload: { user, response },
  };
};

export const loginReset = () => {
  return {
    type: LOGIN_RESET,
    payload: {},
  };
};

export const loginSuccess = response => {
  return {
    type: LOGIN_SUCCESS,
    payload: response,
  };
};

export const logoutUser = history => {
  return {
    type: LOGOUT_USER,
    payload: { history },
  };
};

export const logoutUserSuccess = () => {
  return {
    type: LOGOUT_USER_SUCCESS,
    payload: {},
  };
};
export const loginVerifyUser = (otp, access_token, history) => {
  return {
    type: LOGIN_VERIFY_USER,
    payload: { otp, access_token, history },
  };
};

export const apiError = error => {
  return {
    type: API_ERROR,
    payload: { error },
  };
};

export const socialLogin = (type, history) => {
  return {
    type: SOCIAL_LOGIN,
    payload: { type, history },
  };
};

export const verifyToken = access_token => {
  return {
    type: LOGIN_USER,
    payload: { access_token },
  };
};

export const selectOrganisation = organization => {
  return {
    type: SELECT_ORGANISATION,
    payload: { organization },
  };
};
