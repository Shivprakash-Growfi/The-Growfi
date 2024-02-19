import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';

// Login Redux States
import {
  LOGIN_USER,
  LOGIN_VERIFY_USER,
  LOGOUT_USER,
  SOCIAL_LOGIN,
} from './actionTypes';
import {
  apiError,
  loginSuccess,
  logoutUserSuccess,
  loginUserOtp,
} from './actions';

//Include Both Helper File with needed methods
import {
  getLoginUser,
  getLoginVerifyUser,
} from '../../../helpers/backend_helper';

import { Path } from 'routes/constant';

function* loginUser({ payload: { user, history } }) {
  try {
    const response = yield call(getLoginUser, user);
    yield put(loginUserOtp(user, response));
  } catch (error) {
    yield put(
      apiError('Sorry! something went wrong, please contact our support team')
    );
  }
}

function* loginVerifyUser({ payload: { otp, access_token, history } }) {
  try {
    const response = yield call(getLoginVerifyUser, {
      otp,
      access_token,
    });
    if (localStorage.getItem('authUser')) {
      localStorage.removeItem('authUser');
    }
    localStorage.setItem(
      'authUser',
      JSON.stringify({ access_token: response.data.access_token })
    );
    yield put(loginSuccess(response.data));
    history(Path.DASHBOARD);
  } catch (error) {
    let message = '';
    switch (error.response.statusCode) {
      case 404:
      case 500:
        message =
          'Sorry! something went wrong, please contact our support team';
        break;
      default:
        message = 'Invalid OTP, Please try again !';
    }
    yield put(apiError(message));
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem('authUser');
    sessionStorage.clear();
    yield put(logoutUserSuccess());
    history(Path.LOGIN);
  } catch (error) {
    yield put(apiError(error));
  }
}

function* socialLogin({ payload: { type, history } }) {
  try {
    if (response) history('/dashboard');
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeLatest(SOCIAL_LOGIN, socialLogin);
  yield takeEvery(LOGOUT_USER, logoutUser);
  yield takeEvery(LOGIN_VERIFY_USER, loginVerifyUser);
}

export default authSaga;
