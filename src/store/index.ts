import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../store/slices/chatSlice';
import chatIdReducer from '../store/slices/sessionIdSlice';
import historyReducer from '../store/slices/historySlice';
import authReducer from '../store/slices/login';  // ✅ Correct import
import clickReducer from '../store/slices/clickSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    chatId: chatIdReducer,
    history: historyReducer,
    auth: authReducer,  // ✅ Properly registered auth reducer
    click: clickReducer,
  },
});

// Typings for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed version of useDispatch
import { useDispatch } from 'react-redux';
export const useAppDispatch: () => AppDispatch = useDispatch;
