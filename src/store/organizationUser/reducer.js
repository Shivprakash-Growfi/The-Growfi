import {
  GET_USERS,
  GET_USERS_SUCCESS,
  GET_USERS_FAIL,
  ADD_USER_SUCCESS,
  ADD_USER_FAIL,
  UPDATE_USER_BY_ADMIN_SUCCESS,
  UPDATE_USER_BY_ADMIN_FAIL,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_FAIL,
  RESET_ERROR_STATE_ORGANIZATION_USER,
} from './actionTypes';

const INIT_STATE = {
  users: [],
  userProfile: {},
  error: {},
  isLoading: false,
};

const organizationUser = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        isLoading: true,
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
        isLoading: false,
      };

    case GET_USERS_FAIL:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case ADD_USER_SUCCESS:
      return {
        ...state,
        users: [...state.users, action.payload],
      };

    case ADD_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        userProfile: action.payload,
      };

    case UPDATE_USER_BY_ADMIN_SUCCESS:
      return {
        ...state,
        users: state.users.map(user =>
          user.id.toString() === action.payload.id.toString()
            ? { user, ...action.payload }
            : user
        ),
      };

    case UPDATE_USER_BY_ADMIN_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.filter(
          user => user.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_USER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_USER_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case RESET_ERROR_STATE_ORGANIZATION_USER:
      return {
        ...state,
        error: {},
      };

    default:
      return state;
  }
};

export default organizationUser;
