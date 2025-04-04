import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "api/axiosInstance";
import axios from "axios";
import Cookies from "js-cookie";

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: true, // Assuming user is logged in initially
  loading: false,
  error: null,
};




export const logoutUser = createAsyncThunk("/logout", async (_, thunkAPI) => {
  try {
    // ✅ Get JWT token from cookies
    const token = Cookies.get("jwt");

    if (!token) {
      return thunkAPI.rejectWithValue("No token found in cookies");
    }

    // ✅ Send logout request with token in Authorization header
    await axiosInstance.post(
      "/logout",
      {},
      {
        headers: { Authorization: `Bearer ${token}` }, // Send JWT in headers
        withCredentials: true, // Send cookies (if needed)
      }
    );

    // ✅ Remove cookies manually after logout
    Cookies.remove("jwt", { path: "/" });
    Cookies.remove("userType", { path: "/" });

    console.log("✅ Cookies removed after logout:", Cookies.get("jwt")); // Should be undefined

    return true;
  } catch (error: any) {
    console.error("Logout error:", error);
    return thunkAPI.rejectWithValue(error.response?.data || "Logout failed");
  }
});


  

// Auth slice
const logoutSlice = createSlice({
  name: "logout",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false; // User logged out
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default logoutSlice.reducer;
