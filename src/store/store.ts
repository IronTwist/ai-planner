import { configureStore } from '@reduxjs/toolkit';
import authReduce from './reducers/auth-slice';
import modalReducer from './reducers/modal-slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReduce,
      modal: modalReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const store = makeStore();
