import { SET_TOAST_MESSAGE, REMOVE_TOAST_MESSAGE } from './actionTypes';

export const setToastMessage = (message, messageType) => ({
  type: SET_TOAST_MESSAGE,
  payload: { message, messageType },
});

export const removeToastMessage = () => ({
  type: REMOVE_TOAST_MESSAGE,
  payload: {},
});
