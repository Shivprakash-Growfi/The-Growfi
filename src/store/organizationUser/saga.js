import { call, put, takeEvery } from 'redux-saga/effects';

// Crypto Redux States
import {
  GET_USERS,
  GET_USER_PROFILE,
  ADD_NEW_USER,
  DELETE_USER,
  UPDATE_USER_BY_ADMIN,
} from './actionTypes';

import {
  getUsersSuccess,
  getUsersFail,
  getUserProfileSuccess,
  getUserProfileFail,
  addUserFail,
  addUserSuccess,
  updateUserByAdminSuccess,
  updateUserByAdminFail,
  deleteUserSuccess,
  deleteUserFail,
} from './actions';

import {
  ApiNotificationLoading,
  ApiNotificationUpdate,
} from 'components/Notification/ToastNotification';

//Include Both Helper File with needed methods
import {
  getOrgUsers,
  getUserProfile,
  addNewOrgUser,
  updateOrgUser,
  updateOrgUserByAdmin,
  deleteOrgUser,
} from '../../helpers/backend_helper';
import { setToastMessage } from 'store/actions';

function* fetchUsers({ payload: data }) {
  try {
    const response = yield call(getOrgUsers, data);
    yield put(getUsersSuccess(response.data));
  } catch (error) {
    yield put(getUsersFail(error.response.data));
  }
}

function* fetchUserProfile() {
  try {
    const response = yield call(getUserProfile);
    yield put(getUserProfileSuccess(response));
  } catch (error) {
    yield put(getUserProfileFail(error));
  }
}

function* onUpdateUserByAdmin({ payload: data }) {
  const popUpID = ApiNotificationLoading();
  try {
    const response = yield call(updateOrgUserByAdmin, data);
    yield put(updateUserByAdminSuccess(response.data));
    yield ApiNotificationUpdate(popUpID, 'User Updated Successfully', 2);
  } catch (error) {
    yield put(updateUserByAdminFail(error.response.data));
    yield ApiNotificationUpdate(popUpID, 'User Update Failed', 4);
  }
}

function* onDeleteUser({ payload: data }) {
  const popUpID = ApiNotificationLoading();
  try {
    const response = yield call(deleteOrgUser, data);
    yield put(deleteUserSuccess(data.user));
    yield ApiNotificationUpdate(popUpID, 'User Deleted Successfully', 2);
  } catch (error) {
    yield put(deleteUserFail(error.response.data));
    yield ApiNotificationUpdate(popUpID, 'User Deletion Failed', 4);
  }
}

function* onAddNewUser({ payload: data }) {
  const popUpID = ApiNotificationLoading();
  try {
    const response = yield call(addNewOrgUser, data);

    yield put(addUserSuccess(response.data));
    yield ApiNotificationUpdate(popUpID, 'User Added Successfull', 2);
  } catch (error) {
    yield put(addUserFail(error.response.data));
    yield ApiNotificationUpdate(popUpID, 'User Addition Failed', 4);
  }
}

function* organizationUserSaga() {
  yield takeEvery(GET_USERS, fetchUsers);
  yield takeEvery(GET_USER_PROFILE, fetchUserProfile);
  yield takeEvery(ADD_NEW_USER, onAddNewUser);
  yield takeEvery(UPDATE_USER_BY_ADMIN, onUpdateUserByAdmin);
  yield takeEvery(DELETE_USER, onDeleteUser);
}

export default organizationUserSaga;
