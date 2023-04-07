import { configureStore } from '@reduxjs/toolkit';
import { postsReducer } from './slices/posts';
import { authReducer } from './slices/auth';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

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

// Типизация useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
