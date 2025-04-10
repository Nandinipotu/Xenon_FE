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
  string,                 // Return type (sessionId to delete)
  string,                 // Argument type (sessionId)
  { rejectValue: string }  // Rejected value type
>(
  'history/deleteHistory',
  async (sessionId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/history/delete-history?sessionId=${sessionId}`);
      return sessionId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete history');
    }
  }
);

const initialState: HistoryState = {
  todayData: [],               // Separate state for today's history
  yesterdayData: [], 
  lastSevenDays: [],
  lastThirtyDays:[], 
  count: 0,         // Separate state for yesterday's history
  status: 'idle',
  error: null,
  selectedHistory: null,
  history: [],
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
        state.count = action.payload.length; // Set count based on data length

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
      })

      .addCase(deleteHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const sessionId = action.payload;
      
        // Update all arrays where the item might exist
        state.todayData = state.todayData.filter((item) => item.sessionId !== sessionId);
        state.yesterdayData = state.yesterdayData.filter((item) => item.sessionId !== sessionId);
        state.lastSevenDays = state.lastSevenDays.filter((item) => item.sessionId !== sessionId);
        state.lastThirtyDays = state.lastThirtyDays.filter((item) => item.sessionId !== sessionId);
      })
      
    
      .addCase(deleteHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to delete history';
      });

  },
});

export const { setSelectedHistory,resetSelectedHistory } = historySlice.actions;

export default historySlice.reducer;
