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
};
