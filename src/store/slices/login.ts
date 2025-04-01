import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, { oauthInstance } from "api/axiosInstance";
import axios from "axios";





export const fetchGoogleAccount = createAsyncThunk<
    GoogleAuth[],              
    void,                       
    { rejectValue: string }     
>(
    'history/fetchGoogleAccount',
    async (_, { rejectWithValue }) => {
        try {
            // Use the full endpoint URL directly
            const response = await axios.get(`http://localhost:8090/oauth2/authorization/google`);
            return response.data || [];
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch Google account');
        }
    }
);




const initialState: AuthState = {
    loading: false,
    data: [],
    error: null,
};


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => { 
        builder
            .addCase(fetchGoogleAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGoogleAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload; 
                state.error = null;
            })
            .addCase(fetchGoogleAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Error occurred while fetching data';
            });
    },
});

export default authSlice.reducer;
