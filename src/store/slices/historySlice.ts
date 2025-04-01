import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from 'api/axiosInstance';

export const fetchTodayHistory = createAsyncThunk<
  HistoryItem[],             
  void,                       
  { rejectValue: string }     
>(
  'history/fetchTodayHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/history/today`);
      return response.data?.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch today history');
    }
  }
);

export const fetchYesterdayHistory = createAsyncThunk<
  HistoryItem[],             
  void,                       
  { rejectValue: string }     
>(
  'history/fetchYesterdayHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/history/yesterday`);
      return response.data?.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch yesterday history');
    }
  }
);

export const fetchLastSevenDayHistory = createAsyncThunk<
  HistoryItem[],             
  void,                       
  { rejectValue: string }     
>(
  'history/fetchLastSevenDayHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/history/last-7-days`);
      return response.data?.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch yesterday history');
    }
  }
);
export const fetchLastThirtyDayHistory = createAsyncThunk<
  HistoryItem[],             
  void,                       
  { rejectValue: string }     
>(
  'history/fetchThirtyDayHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/history/last-30-days`);
      return response.data?.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch yesterday history');
    }
  }
);
export const deleteHistory = createAsyncThunk<
  HistoryItem[],            
  string,                  
  { rejectValue: string }    
>(
  'history/deleteHistory',
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/history/delete-history?sessionId=${sessionId}`);
      return response.data?.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete history');
    }
  }
);

const initialState: HistoryState = {
  todayData: [],               // Separate state for today's history
  yesterdayData: [], 
  lastSevenDays: [],
  lastThirtyDays:[],          // Separate state for yesterday's history
  status: 'idle',
  error: null,
  selectedHistory: null,
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setSelectedHistory: (state, action) => {
      state.selectedHistory = action.payload;
    },
    resetSelectedHistory: (state) => {
      state.selectedHistory = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Today History
      .addCase(fetchTodayHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodayHistory.fulfilled, (state, action: PayloadAction<HistoryItem[]>) => {
        state.status = 'succeeded';
        state.todayData = action.payload;
      })
      .addCase(fetchTodayHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred';
      })

      // Yesterday History
      .addCase(fetchYesterdayHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchYesterdayHistory.fulfilled, (state, action: PayloadAction<HistoryItem[]>) => {
        state.status = 'succeeded';
        state.yesterdayData = action.payload;
      })
      .addCase(fetchYesterdayHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred';
      })

      .addCase(fetchLastSevenDayHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLastSevenDayHistory.fulfilled, (state, action: PayloadAction<HistoryItem[]>) => {
        state.status = 'succeeded';
        state.lastSevenDays = action.payload;  // Store the 7 days data
      })
      .addCase(fetchLastSevenDayHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred';
      })
      .addCase(fetchLastThirtyDayHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLastThirtyDayHistory.fulfilled, (state, action: PayloadAction<HistoryItem[]>) => {
        state.status = 'succeeded';
        state.lastSevenDays = action.payload;  // Store the 7 days data
      })
      .addCase(fetchLastThirtyDayHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'An error occurred';
      });

  },
});

export const { setSelectedHistory,resetSelectedHistory } = historySlice.actions;

export default historySlice.reducer;
