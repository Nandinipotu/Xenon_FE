import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "api/axiosInstance";
import Cookies from "js-cookie";

// Define the AuthState interface
interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  userType: 'guest' | 'google' | null;
  data: {
    name?: string;
    email?: string;
    picture?: string;
  } | null; 
}

// Initial state with values from cookies
const initialState: AuthState = {
  token: Cookies.get("jwt") || null,
  loading: false,
  error: null,
  isAuthenticated: !!Cookies.get("jwt"),
  userType: (() => {
    const userType = Cookies.get("userType");
    return userType === "guest" || userType === "google" ? userType : null;
  })(),
  data: null,
};


export const Guestlogin = createAsyncThunk(
    "auth/guestLogin",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post("/guest/login");
        if (response.data.status) {
          const token = response.data.data.token;
          if (token) {
            // Store the token and user type in cookies with improved settings
            Cookies.set("jwt", token, { expires: 7, sameSite: "None", secure: true });
            Cookies.set("userType", "guest", { expires: 7, sameSite: "None", secure: true });
  
            // Log for verification
            console.log("Guest token stored in cookies:", Cookies.get("jwt"));
            console.log("User type stored in cookies:", Cookies.get("userType"));
  
            return { token, userType: "guest" };
          }
          return rejectWithValue("Token not found in response");
        } else {
          return rejectWithValue(response.data.message || "Login failed");
        }
      } catch (error: any) {
        console.error("Guest login error:", error);
        return rejectWithValue(error.response?.data?.message || "Login failed");
      }
    }
  );
  
  

// 🔑 Google Login Thunk
export const fetchGoogleAccount = createAsyncThunk(
    "auth/fetchGoogleAccount",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.get("/login/google", {
          withCredentials: true,
        });
  
        console.log("Google Login Response:", response.data);
  
        const token = response.data?.data?.jwt;
        const picture = response.data?.data?.picture; // ✅ Extract picture
        const name = response.data?.data?.name;
        const email = response.data?.data?.email;
  
        if (token) {
          Cookies.set("jwt", token, { expires: 7, sameSite: "Lax", secure: true });
          Cookies.set("userType", "google", { expires: 7, sameSite: "Lax", secure: true });
          console.log("Google token stored in cookies:", Cookies.get("jwt"));
  
          return { token, picture, name, email };
        }
  
        return rejectWithValue("Token not found in response");
      } catch (error: any) {
        console.error("Google login error:", error);
        return rejectWithValue(error.message || "Failed to fetch Google account");
      }
    }
  );

// 🔒 Logout Action
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.userType = null;
      state.data = null; 
      Cookies.remove("jwt");
      Cookies.remove("userType");
      console.log("Logged out: Cookies cleared");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Guestlogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.userType = "guest";
        state.error = null;
      })
      .addCase(fetchGoogleAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.data = {
            name: action.payload.name,
            email: action.payload.email,
            picture: action.payload.picture, // ✅ Store picture
          };
        state.isAuthenticated = true;
        state.userType = "google";
        state.error = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
