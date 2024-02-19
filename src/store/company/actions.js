import {
  GET_COMPANY_ATTRIBUTES,
  GET_COMPANY_ATTRIBUTES_SUCCESS,
  GET_COMPANY_ATTRIBUTES_FAIL,
} from './actionTypes';

export const getCompanyAttributes = () => ({
  type: GET_COMPANY_ATTRIBUTES,
});

export const getCompanyAttributesSuccess = companyDetails => ({
  type: GET_COMPANY_ATTRIBUTES_SUCCESS,
  payload: companyDetails,
});

export const getCompanyAttributesFail = error => ({
  type: GET_COMPANY_ATTRIBUTES_FAIL,
  payload: error,
});
