import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk("user/getUser", async () => {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/users?_limit=10"
  );
  const data = await response.json();
  return data;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    data: { user: {}, session: {} },
    error: null,
  } as any,
  reducers: {
    addUser: (state, action) => {
      state.data = { ...state.data, user: action.payload };
    },
    addSession: (state, action) => {
      state.data = { ...state.data, session: action.payload };
    },
    addUserError: (state, action) => {
      state.error = JSON.parse(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

// Action creators are generated for each case reducer function
export const { addUser, addUserError, addSession } = userSlice.actions;

export default userSlice.reducer;
