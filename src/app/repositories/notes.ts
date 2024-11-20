import { Note } from '@/store/reducers/notes-slice';
import { User } from '@/types';

export const notesRepository = {
  addNote: async () => {},
  getNotes: async (user: User) => {
    const resp = await fetch(`/api/store/notes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
    });
    const data = await resp.json();
    return data;
  },
  getNote: async (user: User, id: string) => {
    const resp = await fetch(`/api/store/notes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
    });
    console.log('resp:', resp);
    const data = await resp.json();
    return data;
  },
  setNotes: async () => {},
  deleteNote: async (id: string, user: User) => {
    const resp = await fetch(`/api/store/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
    });
    const data = await resp.json();
    return data;
  },
  updateNote: async (note: Note, user: User) => {
    const resp = await fetch(`/api/store/notes/${note.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(note),
    });
    const data = await resp.json();
    return data;
  },
};
