"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ApiService from "@/app/api/route";
import Cookies from "js-cookie";
import { AppState } from "../store";

const api = new ApiService();

interface AuthData {
  grant_type: string;
  username: string;
  password: string;
  client_id: string;
}

export interface User {
  [key: string]: any;
}

export interface AuthState {
  user: User;
  token: string;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: {},
  token: "",
  isAuthenticated: false,
};

export const loginAsync = createAsyncThunk(
  "user/login",
  async (authData: AuthData, { rejectWithValue }) => {
    try {
      const response: any = await api.post("token", authData);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    logoutUser: (state) => {
      state.user = {};
      state.token = "";
      state.isAuthenticated = false;
      Cookies.remove("token", { path: "/" });
      if (typeof localStorage !== "undefined") localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      state.user = action.payload;
      state.token = action.payload.access_token;
      if (state.token) state.isAuthenticated = true;
      localStorage.setItem("access_token", action.payload.access_token);
      Cookies.set("token", action.payload.access_token);
      localStorage.setItem("user", JSON.stringify(action.payload));
    });
  },
});

export const { logoutUser, reset } = authSlice.actions;
export const selectUser = (state: AppState) => state.auth.user;
export const selectToken = (state: AppState) => state.auth.token;
export const isAuthenticated = (state: AppState) => state.auth.isAuthenticated;

export default authSlice.reducer;

//initialState = state
//selector = getters
//reducer = mutations
//thunk = actions
