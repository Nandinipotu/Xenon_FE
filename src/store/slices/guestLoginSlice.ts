import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'api/axiosInstance';

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;  // Added
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),  // Load token from localStorage
  loading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),  // Set initial auth state
};

// Async thunk for login
export const Guestlogin = createAsyncThunk(
  'auth/login',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/guest/login');
      if (response.data.status) {
        return { token: response.data.data };  // ✅ Store the token from the response
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
      state.isAuthenticated = false;
      localStorage.removeItem('token');
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
        state.isAuthenticated = true;  // ✅ Set isAuthenticated to true
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(Guestlogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;  // ✅ Set isAuthenticated to false
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
