import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'api/axiosInstance';
import Cookies from 'js-cookie';

interface AuthState {
  token: string | null;
  guestSessionId: string | null; // Added session ID
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isGuestUser: boolean; // Added to track if user is guest
}

const initialState: AuthState = {
  token: Cookies.get("jwt") || null,
  guestSessionId: Cookies.get("guestSessionId") || null,
  loading: false,
  error: null,
  isAuthenticated: !!Cookies.get("jwt"),
  isGuestUser: Cookies.get("userType") === "guest"
};

// Async thunk for guest login
export const Guestlogin = createAsyncThunk(
  'auth/guestLogin',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/guest/login');
      if (response.data.status) {
        const { token, guestSessionId } = response.data.data;
        
        // Store both token and sessionId in cookies
        Cookies.set("jwt", token, {
          secure: true,
          sameSite: "None",
          expires: 1,
        });
        
        Cookies.set("guestSessionId", guestSessionId, {
          secure: true,
          sameSite: "None",
          expires: 1,
        });
        
        Cookies.set("userType", "guest", {
          secure: true,
          sameSite: "None",
          expires: 1,
        });
        
        return { 
          token,
          guestSessionId
        };
      } else {
        return rejectWithValue(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.guestSessionId = null;
      state.isAuthenticated = false;
      state.isGuestUser = false;
      Cookies.remove("jwt");
      Cookies.remove("guestSessionId");
      Cookies.remove("userType");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Guestlogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(Guestlogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.guestSessionId = action.payload.guestSessionId;
        state.isAuthenticated = true;
        state.isGuestUser = true;
      })
      .addCase(Guestlogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.isGuestUser = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;