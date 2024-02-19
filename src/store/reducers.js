import { combineReducers } from 'redux';

// Front
import Layout from './layout/reducer';

// Authentication
import Login from './auth/login/reducer';
import Profile from './auth/profile/reducer';

//Dashboard
import Dashboard from './dashboard/reducer';

//Company
import Company from './company/reducer';

//Organization Users
import organizationUser from './organizationUser/reducer';

//toast
import toast from './toast/reducer';

const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Profile,
  Dashboard,
  Company,
  organizationUser,
  toast,
});

export default rootReducer;
