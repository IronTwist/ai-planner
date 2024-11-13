/* eslint-disable @typescript-eslint/no-explicit-any */
// import firebase from "./firebase";

export type Action<T = any> = {
  type: string;
  payload?: T;
};

export type Reducer<S, A extends Action> = (state: S, action: A) => S;

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    firstName: string;
  };
  error: null;
}

export type Note = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export type StoreType = {
  auth: {
    isAuthenticated: boolean;
    user: {
      userName: string;
      email: string;
    };
    token: string;
  };
  notes: Note[] | [];
};

export type User = {
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
