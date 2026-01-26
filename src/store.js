import { configureStore } from '@reduxjs/toolkit';
import { messagesApi } from './api/messagesApi';
import userReducer from './features/user/userSlice';

export const store = configureStore({
  reducer: {
    [messagesApi.reducerPath]: messagesApi.reducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(messagesApi.middleware),
});
