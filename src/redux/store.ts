import { configureStore } from '@reduxjs/toolkit';
import { postsReducer } from './slices/posts';
import { authReducer } from './slices/auth';
import { useDispatch } from 'react-redux';

const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
  },
});

// Типизация State
export type RootState = ReturnType<typeof store.getState>;

// Типизация dispatch
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch; // Export a hook that can be reused to resolve types

export default store;
