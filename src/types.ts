/* eslint-disable @typescript-eslint/no-explicit-any */
// types.ts
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
  }
  error: null
}

export type Note = {
  id: string;
  title: string;
  content: string;
  date: string;
}

export type StoreType = {
  auth: {
    isAuthenticated: boolean,
    user: {
      userName: string,
      email: string
    },
    token: string,
  },
  notes: Note[] | [],
};

export type User = {
  id: string,
  userName: string,
  email: string
}
  