import { all, fork } from 'redux-saga/effects';

//public

import AuthSaga from './auth/login/saga';
import ProfileSaga from './auth/profile/saga';
import LayoutSaga from './layout/saga';
import dashboardSaga from './dashboard/saga';
import compnaySaga from './company/saga';
import organizationUserSaga from './organizationUser/saga';

export default function* rootSaga() {
  yield all([
    //public
    fork(AuthSaga),
    fork(ProfileSaga),
    fork(LayoutSaga),
    fork(dashboardSaga),
    fork(compnaySaga),
    fork(organizationUserSaga),
  ]);
}
