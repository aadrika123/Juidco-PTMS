import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const loginData = Cookies.get("loginData");

const initialState = {
  user: loginData ? JSON.parse(loginData) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      Cookies.set("loginData", JSON.stringify(action.payload), { expires: 1 });
    },
    logout: (state) => {
      state.user = null;
      /* Cookies.remove("loginData");
      Cookies.remove("accesstoken");
      Cookies.remove("user_details"); */
      localStorage.clear();
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
