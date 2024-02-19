import { SET_TOAST_MESSAGE, REMOVE_TOAST_MESSAGE } from './actionTypes';

const INIT_STATE = {
  message: '',
  messageType: 0,
  show: false,
};

const toast = (state = INIT_STATE, action) => {
  switch (action.type) {
    case SET_TOAST_MESSAGE:
      state = {
        ...state,
        message: action.payload.message,
        messageType: action.payload.messageType,
        show: true,
      };
      break;
    case REMOVE_TOAST_MESSAGE:
      state = {
        ...INIT_STATE,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default toast;
