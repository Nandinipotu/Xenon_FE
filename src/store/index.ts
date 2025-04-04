import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '../store/slices/chatSlice';
import chatIdReducer from '../store/slices/sessionIdSlice';
import historyReducer from '../store/slices/historySlice';
import authReducer from '../store/slices/login'; 
import clickReducer from '../store/slices/clickSlice';
import logoutReducer from '../store/slices/logout'; 

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    chatId: chatIdReducer,
    history: historyReducer,
    auth: authReducer,  
    click: clickReducer,
    logout: logoutReducer,  
  },
});

// Typings for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed version of useDispatch
import { useDispatch } from 'react-redux';
export const useAppDispatch: () => AppDispatch = useDispatch;
