import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Note = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  url: string;
  pathname: string;
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
    updateNote: (state, action: PayloadAction<Note>) => {
      return {
        ...state,
        loading: false,
        notes: state.notes.map(note =>
          note.id === action.payload.id ? action.payload : note,
        ),
        error: null,
      };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      return {
        ...state,
        loading: action.payload,
      };
    },
  },
});

export const { addNote, setNotes, getNotes, updateNote, setLoading } =
  notes.actions;
export default notes.reducer;
