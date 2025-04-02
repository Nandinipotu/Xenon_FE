import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from 'api/axiosInstance';
import axios from 'axios';

interface ChatIdState {
  chatId: string;
  loading: boolean;
  error: string | null;
}

const initialState: ChatIdState = {
  chatId: '',
  loading: false,
  error: null,
};

export const fetchChatHistory = createAsyncThunk(
  'chatId/fetchChatHistory',
  async (sessionId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/history/${sessionId}`
      );
      return response.data.data.sessionId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const chatIdSlice = createSlice({
  name: 'chatId',
  initialState,
  reducers: {
    setChatId: (state, action: PayloadAction<string>) => {
      state.chatId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.chatId = action.payload;
        state.loading = false;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setChatId } = chatIdSlice.actions;
export default chatIdSlice.reducer;
