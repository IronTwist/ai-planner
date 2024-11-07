import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const modal = createSlice({
  name: 'modal',
  initialState: {
    name: '',
    isOpen: false,
  },
  reducers: {
    openModal: (state, action: PayloadAction<{ name: string }>) => {
      return {
        ...state,
        isOpen: true,
        name: action.payload.name,
      };
    },
    closeModal: state => {
      return {
        ...state,
        isOpen: false,
        name: '',
      };
    },
  },
});

export const { openModal, closeModal } = modal.actions;
export default modal.reducer;
