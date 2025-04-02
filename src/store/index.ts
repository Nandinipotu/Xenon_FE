import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../store/slices/chatSlice';
import chatIdReducer from '../store/slices/sessionIdSlice';  // ✅ Import the chatId reducer
import historyReducer from '../store/slices/historySlice';
import authSlice from '../store/slices/login';
import clickReducer from '../store/slices/clickSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    chatId: chatIdReducer,  // ✅ Register chatId reducer
    history: historyReducer,
    google: authSlice,
    click: clickReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed version of useDispatch
import { useDispatch } from 'react-redux';
export const useAppDispatch: () => AppDispatch = useDispatch;
