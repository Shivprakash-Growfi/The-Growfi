import {
  GET_COMPANY_ATTRIBUTES_SUCCESS,
  GET_COMPANY_ATTRIBUTES_FAIL,
} from './actionTypes';

const INIT_STATE = {
  companyDetails: {},
  error: {},
  isLoading: true,
};

const Company = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_COMPANY_ATTRIBUTES_SUCCESS:
      state = {
        ...state,
        companyDetails: action.payload,
        error: {},
        isLoading: false,
      };
      break;
    case GET_COMPANY_ATTRIBUTES_FAIL:
      state = {
        ...state,
        error: action.payload,
        isLoading: false,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default Company;
