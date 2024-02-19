import {
  LOGIN_USER,
  LOGIN_USER_OTP,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGIN_VERIFY_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  LOGIN_RESET,
  SELECT_ORGANISATION,
} from './actionTypes';

const getSelectedOrganisationFromSession = () => {
  return sessionStorage.getItem('selectedOrganization')
    ? JSON.parse(sessionStorage.getItem('selectedOrganization'))
    : undefined;
};
const initialState = {
  error: '',
  otpProcess: false,
  loading: false,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
      };
      break;
    case LOGIN_USER_OTP:
      state = {
        ...state,
        otpProcess: true,
        error: false,
        username: action.payload.user.username,
        access_token: action.payload.response.data.access_token,
      };
      break;
    case LOGIN_VERIFY_USER:
      state = {
        ...state,
        error: false,
        loading: true,
      };
      break;
    case LOGIN_SUCCESS:
      state = {
        ...state,
        loading: false,
        access_token: undefined,
        user: action.payload,
      };
      break;
    case LOGOUT_USER:
      state = { ...state };
      break;
    case LOGOUT_USER_SUCCESS:
      state = { ...initialState };
      break;
    case API_ERROR:
      state = {
        ...state,
        error: action.payload.error,
        loading: false,
      };
      break;
    case LOGIN_RESET:
      state = {
        ...initialState,
      };
      break;
    case SELECT_ORGANISATION:
      state = {
        ...state,
        selectedOrganization: action.payload.organization,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default login;
