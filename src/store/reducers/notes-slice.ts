import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  url: string;
  pathhname: string;
  downloadUrl: string;
};

interface NotesState {
  loading: boolean;
  notes: Note[];
  error: string | null;
}

const initialState: NotesState = {
  loading: false,
  notes: [],
  error: null,
};

const notes = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Note>) => {
      return {
        ...state,
        loading: false,
        notes: [...state.notes, action.payload],
        error: null,
      };
    },
    setNotes: (state, action: PayloadAction<NotesState>) => {
      return {
        ...state,
        loading: false,
        notes: action.payload.notes,
        error: action.payload.error,
      };
    },
    getNotes: (state, action: PayloadAction<NotesState>) => {
      return {
        ...state,
        loading: false,
        notes: action.payload.notes,
        error: action.payload.error,
      };
    },
  },
});

export const { addNote, setNotes, getNotes } = notes.actions;
export default notes.reducer;
