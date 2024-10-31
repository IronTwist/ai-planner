import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  loading: boolean;
  data: {
    user: {
      uid: string;
      userName: string;
      email: string;
      isAuth: boolean;
    };
    token: string;
  };
  error: string | null;
};

const initialState = {
  loading: false,
  data: {
    user: {
      uid: "",
      userName: "",
      email: "",
      isAuth: false,
    },
    token: "",
  },
  error: null,
} as InitialState;

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loading: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        loading: action.payload,
      }
    },
    logIn: (_state, action: PayloadAction<{ user: {
      uid: string;
      userName: string;
      email: string;
  }; token: string }>) => {
    
      return {
        loading: false,
        data: {
          user: {
            uid: "234234324dawd",
            userName: action.payload.user.userName,
            email: action.payload.user.email,
            isAuth: true,
          },
          token: action.payload.token,
        },
        error: null,
      };
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
    },
    logOut: () => {
      return initialState;
    },
  },
});

export const { loading, logIn, logOut, loginFailure } = auth.actions;

export default auth.reducer;
