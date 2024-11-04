import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import firebase from '@/firebase';
import { UserSignUpResponse } from '@/app/auth/sign-up/page';

type InitialState = {
  loading: boolean;
  user: {
    uid: string | null;
    userName: string | null;
    email: string | null;
    refreshToken: string | null;
    newAccount: boolean;
  } | null;
  error: string | null;
};

const initialState = {
  loading: false,
  user: {
    uid: null,
    email: null,
    refreshToken: null,
    newAccount: false,
  },
  error: null,
} as InitialState;

export const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loading: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        loading: action.payload,
      };
    },
    signUp: (state, action: PayloadAction<{ user: UserSignUpResponse }>) => {
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        error: null,
      };
    },
    setUser: (state, action: PayloadAction<{ user: UserSignUpResponse }>) => {
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        error: null,
      };
    },
    authError: (state, action) => {
      return {
        ...state,
        loading: false,
        user: null,
        error: action.payload.message,
      };
    },
    logIn: (
      _state,
      action: PayloadAction<{
        user: UserSignUpResponse;
      }>,
    ) => {
      return {
        loading: false,
        user: action.payload.user,
        error: null,
      };
    },
    logOut: () => {
      return initialState;
    },
  },
});

export const { loading, logIn, logOut, signUp, setUser, authError } =
  auth.actions;

export default auth.reducer;
