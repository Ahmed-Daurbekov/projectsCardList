import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counterSlice.ts';
import firebaseReducer from './firebase/firebaseSlice.ts';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    firebase: firebaseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
