import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import firebase from '@/service/client/firebase';
import { UserSignUpResponseType } from '@/app/auth/sign-up/page';
import { deleteCookie } from '@/session/client-session';

type InitialState = {
  loading: boolean;
  user: {
    uid: string | null;
    userName: string | null;
    email: string | null;
    refreshToken: string | null;
    newAccount: boolean;
    token: string | null;
    metadata: {
      createdAt: string;
      lastLoginAt: string;
    };
  } | null;
  error: string | null;
};

const initialState = {
  loading: false,
  user: {
    uid: null,
    userName: null,
    email: null,
    refreshToken: null,
    newAccount: false,
    token: null,
    metadata: {
      createdAt: '',
      lastLoginAt: '',
    },
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
    signUp: (
      state,
      action: PayloadAction<{ user: UserSignUpResponseType }>,
    ) => {
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        error: null,
      };
    },
    setUser: (
      state,
      action: PayloadAction<{ user: UserSignUpResponseType }>,
    ) => {
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
        user: UserSignUpResponseType;
      }>,
    ) => {
      return {
        loading: false,
        user: action.payload.user,
        error: null,
      };
    },
    logOut: () => {
      firebase.auth().signOut();
      deleteCookie('ai-planner-session');

      return initialState;
    },
  },
});

export const { loading, logIn, logOut, signUp, setUser, authError } =
  auth.actions;

export default auth.reducer;
