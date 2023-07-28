import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { AppState, AppThunk } from "..";
import ApiService from "@/services/apiService";

import Cookies from "js-cookie";

const api = new ApiService();

interface AuthData {
  grant_type: string;
  username: string;
  password: string;
  client_id: string;
}

export interface AuthState {
  user: object;
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      state.user = action.payload;
      console.log(action.payload);
      state.token = action.payload.access_token;
      localStorage.setItem("user", action.payload.userId);
      localStorage.setItem(
        "userName",
        action.payload.firstName + " " + action.payload.lastName
      );
      localStorage.setItem("access_token", action.payload.access_token);
      Cookies.set("token", action.payload.access_token);
      if (state.token) state.isAuthenticated = true;
    });
  },
});

//export const { login } = authSlice.actions;

export const selectUser = (state: AppState) => state.auth.user;
export const selectToken = (state: AppState) => state.auth.token;
export const isAuthenticated = (state: AppState) => state.auth.isAuthenticated;

export default authSlice.reducer;

//initialState = state
//selector = getters
//reducer = mutations
//thunk = actions
