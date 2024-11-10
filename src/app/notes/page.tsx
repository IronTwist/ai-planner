'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openModal } from '@/store/reducers/modal-slice';
import { Note, setNotes } from '@/store/reducers/notes-slice';
import { AppDispatch } from '@/store/store';
import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';

export default function Notes() {
  const dispatch = useAppDispatch<AppDispatch>();
  const notes = useAppSelector(state => state.notes.notes);
  const [fetchedNotes, setFetchedNotes] = useState<Note[]>(notes);
  const user = useAppSelector(state => state.auth.user);

  const handleAddNote = () => {
    dispatch(openModal({ name: 'addNoteModal' }));
  };

  // TODO extract all functions to a repository and call GET on login
  useEffect(() => {
    if (user && notes?.length === 0) {
      fetch(`/api/store/notes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then(resp => resp.json())
        .then(data => {
          console.log('data', data);
          if (data.error?.code === 'auth/id-token-expired') {
            dispatch(openModal({ name: 'loginModal' }));
          }

          setFetchedNotes(data.data);
          dispatch(
            setNotes({ notes: data.data, loading: false, error: data.error }),
          );
        });
      // .catch(err => console.error('An error occurred', err));
    }
  }, [dispatch, notes, user]);

  return (
    <div className='flex flex-col p-8'>
      <Box className='flex gap-2 w-full'>
        <Button variant='contained' onClick={() => window.history.back()}>
          Back
        </Button>

        <Box
          sx={{
            background: 'linear-gradient(white, rgb(165, 194, 251, 0.7))',
          }}
          className='w-full'
        >
          <Button variant='outlined' onClick={handleAddNote}>
            Add
          </Button>
        </Box>
      </Box>
      <Box>
        {fetchedNotes
          //   ?.sort(
          //     (a, b) => b.createdAt - a.date,
          //   )
          ?.map(note => (
            <div
              className='flex flex-col gap-2 border border-gray-400 p-4'
              key={note.id}
            >
              <h1>{note.title}</h1>
              <p>{note.content}</p>
              <p>{note.date}</p>
            </div>
          ))}
      </Box>
    </div>
  );
}
