import {AUTH_SUCCESS, LOGOUT} from "./types";

export const authSuccess = (data) => ({
  type:    AUTH_SUCCESS,
  payload: data,
});
export const logout = () => ({
  type:    LOGOUT
});