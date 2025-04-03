import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "api/axiosInstance";
import axios from "axios";

// authSlice.ts
interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  userType: 'guest' | 'google' | null;  
  data: any[];
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),
  userType: (() => {
    const userType = localStorage.getItem("userType");
    return userType === "guest" || userType === "google" ? userType : null;
  })(),
  data: [],
};

// 🔑 Guest Login
export const Guestlogin = createAsyncThunk(
  "auth/guestLogin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/guest/login");
      if (response.data.status) {
        localStorage.setItem("userType", "guest");
        return { token: response.data.data, userType: 'guest' };
      } else {
        return rejectWithValue(response.data.message || "Login failed");
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// 🔑 Google OAuth Login
export const fetchGoogleAccount = createAsyncThunk(
  "auth/fetchGoogleAccount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:8090/oauth2/authorization/google"
      );
      localStorage.setItem("userType", "google");
      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch Google account");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.userType = null;
      state.data = [];
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Guestlogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.userType = 'guest';
        state.error = null;
      })
      .addCase(fetchGoogleAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isAuthenticated = true;
        state.userType = 'google';
        state.error = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
