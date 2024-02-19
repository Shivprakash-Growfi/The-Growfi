import { takeEvery, put, call } from 'redux-saga/effects';

// Calender Redux States
import { GET_COMPANY_ATTRIBUTES } from './actionTypes';
import {
  getCompanyAttributesFail,
  getCompanyAttributesSuccess,
} from './actions';

//Include Both Helper File with needed methods
import { getCompanyDetails } from '../../helpers/backend_helper';

function* fetchCompanyAttributes() {
  try {
    const response = yield call(getCompanyDetails);
    yield put(getCompanyAttributesSuccess(response.data));
  } catch (error) {
    yield put(getCompanyAttributesFail(error));
  }
}

function* compnaySaga() {
  yield takeEvery(GET_COMPANY_ATTRIBUTES, fetchCompanyAttributes);
}

export default compnaySaga;
