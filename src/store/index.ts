// store.ts
import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../store/slices/chatSlice';
import historyReducer from '../store/slices/historySlice';
import authSlice from '../store/slices/login';
import clickReducer from '../store/slices/clickSlice'; // ✅ Import clickSlice

export const store = configureStore({
    reducer: {
        chat: chatReducer,
        history: historyReducer,
        google: authSlice,
        click: clickReducer, // ✅ Add click reducer here
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ✅ Use a typed version of useDispatch
import { useDispatch } from 'react-redux';
export const useAppDispatch: () => AppDispatch = useDispatch;
