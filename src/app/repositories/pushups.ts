import { User } from '@/types';

export const pushupsRepository = {
  addWorkout: async (
    user: User,
    workout: {
      date: number;
      name: string;
      total: number;
      programLevel: number;
      set1: number;
      set2: number;
      set3: number;
      set4: number;
      set5: number;
    },
  ) => {
    const resp = await fetch(`/api/pushups`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify(workout),
    });

    const data = await resp.json();
    return data;
  },
  getSeries: async (user: User) => {
    const resp = await fetch(`/api/pushups`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
    });

    const data = await resp.json();

    return data;
  },
  removeWorkout: async (user: User, id: string) => {
    const resp = await fetch(`/api/pushups`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({ id }),
    });
    await resp.json();
  },
  //   getNote: async (user: User, id: string) => {
  //     const resp = await fetch(`/api/store/notes/${id}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${user?.token}`,
  //       },
  //     });

  //     const data = await resp.json();
  //     return data;
  //   },
  //   deleteNote: async (id: string, user: User) => {
  //     const resp = await fetch(`/api/store/notes/${id}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${user?.token}`,
  //       },
  //     });
  //     const data = await resp.json();
  //     return data;
  //   },
  //   updateNote: async (note: Note, user: User) => {
  //     const resp = await fetch(`/api/store/notes/${note.id}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${user?.token}`,
  //       },
  //       body: JSON.stringify(note),
  //     });
  //     const data = await resp.json();
  //     return data;
  //   },
};
