import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Load state from local storage if available
const initialState = localStorage.getItem("loggedInUser")
  ? JSON.parse(localStorage.getItem("loggedInUser"))
  : {
      isLoggedIn: false,
      userType: null,
      user: null,
    };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const { userData } = action.payload;

      state.isLoggedIn = true;
      state.userType = "user";
      state.user = userData;
      localStorage.setItem("loggedInUser", JSON.stringify(state));
    },

    loginVendor: (state, action) => {
      const { vendorData } = action.payload;

      state.isLoggedIn = true;
      state.userType = "vendor";
      state.user = vendorData;
      localStorage.setItem("loggedInUser", JSON.stringify(state));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userType = null;
      state.user = null;
      localStorage.removeItem("loggedInUser");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    },
  },
});

export const { loginUser, loginVendor, logout } = authSlice.actions;

export default authSlice.reducer;
