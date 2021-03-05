import * as apiUtil from "../util/session";
import { User } from "../types";
import { receiveErrors } from "./error";

export const RECEIVE_CURRENT_USER = `RECEIVE_CURRENT_USER`;
export const LOGOUT_CURRENT_USER = `LOGOUT_CURRENT_USER`;

const receiveCurrentUser = (user: User) => ({ type: RECEIVE_CURRENT_USER, user });
const logoutCurrentUser = () => ({ type: LOGOUT_CURRENT_USER });

const makeCall = async (cb: (user: User) => Promise<Response>, user?: User) => {
  const response = await cb(user as User);
  const data = await response.json();
  return { data, ok: response.ok };
};

export const login = (user: User) => async (dispatch) => {
  const { data, ok } = await makeCall(apiUtil.login, user);
  if (ok) {
    return dispatch(receiveCurrentUser(data));
  }
  return dispatch(receiveErrors(data));
};

export const signup = (user: User) => async (dispatch) => {
  const { data, ok } = await makeCall(apiUtil.signup, user);
  if (ok) {
    return dispatch(receiveCurrentUser(data));
  }
  return dispatch(receiveErrors(data));
};

export const logout = () => async (dispatch) => {
  const { data, ok } = await makeCall(apiUtil.logout);
  if (ok) {
    return dispatch(logoutCurrentUser());
  }
  return dispatch(receiveErrors(data));
};
