// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../src/app/Reducers/getUserInfo';

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

