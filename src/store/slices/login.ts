import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "api/axiosInstance";
import axios from "axios";

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  data: any[];  // To hold additional data from Google login
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),  // ✅ Load from localStorage
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem("token"),  // ✅ Set auth state from localStorage
  data: [],
};

// 🔑 Async thunk for guest login
export const Guestlogin = createAsyncThunk(
  "auth/guestLogin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/guest/login");
      if (response.data.status) {
        return { token: response.data.data };  // ✅ Store the token from the response
      } else {
        return rejectWithValue(response.data.message || "Login failed");
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// 🔑 Async thunk for Google OAuth login
export const fetchGoogleAccount = createAsyncThunk<
  any[],                // Payload type
  void,                 // Argument type
  { rejectValue: string }  // Rejection type
>(
  "auth/fetchGoogleAccount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:8090/oauth2/authorization/google"
      );
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
    // Logout reducer to clear auth state
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.data = [];
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    // ✅ Handling Guest Login
    builder
      .addCase(Guestlogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Guestlogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem("token", action.payload.token);  // ✅ Save token
      })
      .addCase(Guestlogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });

    // ✅ Handling Google OAuth Login
    builder
      .addCase(fetchGoogleAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoogleAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.isAuthenticated = true;  // ✅ Set authenticated after successful login
        state.error = null;
      })
      .addCase(fetchGoogleAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error occurred while fetching data";
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
