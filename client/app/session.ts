// See https://remix.run/docs/en/v1/api/remix#sessions.

import axios from "axios";
import { createGlobalState } from "react-use";

export type User = {
  id: number;
  googleId: string;
  googleData: {
    displayName: string;
  };
};

export const useMe = createGlobalState<User>();

// _getMe must be called on the client.
export async function _getMe(): Promise<User> {
  const res = await axios.get(`${window.ENV.API_URL}/user/me`, {
    withCredentials: true,
  });
  return res.data.user;
}
