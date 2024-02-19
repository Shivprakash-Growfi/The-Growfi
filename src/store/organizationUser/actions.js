import {
  GET_USER_PROFILE,
  GET_USER_PROFILE_FAIL,
  GET_USER_PROFILE_SUCCESS,
  GET_USERS,
  GET_USERS_FAIL,
  GET_USERS_SUCCESS,
  ADD_NEW_USER,
  ADD_USER_SUCCESS,
  ADD_USER_FAIL,
  UPDATE_USER_BY_ADMIN,
  UPDATE_USER_BY_ADMIN_SUCCESS,
  UPDATE_USER_BY_ADMIN_FAIL,
  DELETE_USER,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  RESET_ERROR_STATE_ORGANIZATION_USER,
} from './actionTypes';

export const resetErrorStateOrganizationUser = () => ({
  type: RESET_ERROR_STATE_ORGANIZATION_USER,
});

export const getUsers = data => ({
  type: GET_USERS,
  payload: data,
});

export const getUsersSuccess = users => ({
  type: GET_USERS_SUCCESS,
  payload: users,
});

export const addNewUser = data => ({
  type: ADD_NEW_USER,
  payload: data,
});

export const addUserSuccess = user => ({
  type: ADD_USER_SUCCESS,
  payload: user,
});

export const addUserFail = error => ({
  type: ADD_USER_FAIL,
  payload: error,
});

export const getUsersFail = error => ({
  type: GET_USERS_FAIL,
  payload: error,
});

export const getUserProfile = () => ({
  type: GET_USER_PROFILE,
});

export const getUserProfileSuccess = userProfile => ({
  type: GET_USER_PROFILE_SUCCESS,
  payload: userProfile,
});

export const getUserProfileFail = error => ({
  type: GET_USER_PROFILE_FAIL,
  payload: error,
});

export const updateUserbyAdmin = data => ({
  type: UPDATE_USER_BY_ADMIN,
  payload: data,
});

export const updateUserByAdminSuccess = user => ({
  type: UPDATE_USER_BY_ADMIN_SUCCESS,
  payload: user,
});

export const updateUserByAdminFail = error => ({
  type: UPDATE_USER_BY_ADMIN_FAIL,
  payload: error,
});

export const deleteUser = data => ({
  type: DELETE_USER,
  payload: data,
});

export const deleteUserSuccess = user => ({
  type: DELETE_USER_SUCCESS,
  payload: user,
});

export const deleteUserFail = error => ({
  type: DELETE_USER_FAIL,
  payload: error,
});
