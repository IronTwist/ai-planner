'use client';

import { DisplayTooltip } from '@/modules/UI/components/molecules/display-tooltip';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logOut } from '@/store/reducers/auth-slice';
import { openModal } from '@/store/reducers/modal-slice';
import { Note, setNotes } from '@/store/reducers/notes-slice';
import { AppDispatch } from '@/store/store';
import { Box, Button } from '@mui/material';
import { format, formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaRegTrashCan, FaCirclePlus, FaDownload } from 'react-icons/fa6';
import { notesRepository } from '../repositories/notes';
import Image from 'next/image';

export default function Notes() {
  const dispatch = useAppDispatch<AppDispatch>();
  const notes = useAppSelector(state => state.notes.notes);
  const [fetchedNotes, setFetchedNotes] = useState<Note[]>(notes);
  const user = useAppSelector(state => state.auth.user);
  const router = useRouter();
  const [focusNote, setFocusNote] = useState<string>('');

  const handleAddNote = () => {
    dispatch(openModal({ name: 'addNoteModal' }));
  };

  const handleDeleteNote = (id: string) => {
    const alertAnswer = window.confirm(
      'Are you sure you want to delete this note?',
    );

    if (!alertAnswer) return;

    notesRepository.deleteNote(id, user).then(data => {
      setFetchedNotes(fetchedNotes.filter(note => note.id !== id));
      dispatch(setNotes({ notes: data, loading: false, error: null }));
    });
  };

  const handleNoteFocus = (id: string) => {
    setFocusNote(id);
  };

  // TODO extract all functions to a repository and call GET after login
  useEffect(() => {
    if (
      (user && notes?.length === 0) ||
      fetchedNotes?.length !== notes?.length
    ) {
      notesRepository.getNotes(user).then(data => {
        if (data.error?.code === 'auth/id-token-expired') {
          dispatch(logOut());
          router.push(`${window.location.origin}/auth/login`);
        }

        setFetchedNotes(data.data);
        dispatch(
          setNotes({ notes: data.data, loading: false, error: data.error }),
        );
      });
    }
  }, [dispatch, fetchedNotes?.length, notes, router, user]);

  return (
    <div className='flex flex-col p-8'>
      <Box className='flex gap-2 w-full'>
        <Button variant='contained' onClick={() => window.history.back()}>
          Back
        </Button>
      </Box>
      <Box className='NoteTable flex bg-[#eee] h-[80%] p-7 mt-7 gap-6 flex-wrap justify-center'>
        <Box
          sx={
            {
              // background: 'linear-gradient(white, rgb(165, 194, 251, 0.7))',
            }
          }
          className='w-full'
        >
          <Button
            className='gap-2'
            variant='contained'
            size='small'
            onClick={handleAddNote}
          >
            <FaCirclePlus />
            Add
          </Button>
        </Box>
        {fetchedNotes?.map(note => {
          const createdTimeStamp = note.createdAt;
          const date = new Date(createdTimeStamp);
          const createdAt = format(date, 'MMMM do, yyyy, h:mm:ss a');

          return (
            <div
              id='note'
              className='flex flex-col w-[288px] h-72 bg-[#fff] text-black rounded-md gap-2 p-4 pb-0 justify-between shadow-[0_3px_6px_rgba(0,0,0,0.16),_0_3px_6px_rgba(0,0,0,0.23)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.25),_0_10px_10px_rgba(0,0,0,0.22)]'
              key={note.id}
              style={{ userSelect: 'none' }}
              onMouseOver={() => handleNoteFocus(note.id)}
              onPointerEnter={() => handleNoteFocus(note.id)}
            >
              <div className='flex justify-between'>
                {note.title ? (
                  <h2 className='font-bold'>{note.title}</h2>
                ) : (
                  <h2 className='font-bold'>No title</h2>
                )}
                {focusNote === note.id && (
                  <div className='flex gap-2'>
                    <FaDownload
                      className='hover:cursor-pointer'
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = note.downloadUrl;
                        link.download = note.title;
                        link.click();
                      }}
                    />
                    <FaRegTrashCan
                      className='hover:cursor-pointer'
                      onClick={() => handleDeleteNote(note.id)}
                    />
                  </div>
                )}
              </div>
              <div
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#b2a4ed #f0f0f0',
                  scrollbarGutter: 'stable',
                }}
                className='overflow-x-hidden overflow-y-auto'
              >
                <pre className='font-medium font-serif whitespace-pre-wrap scroll'>
                  {note.content}
                </pre>
                {note.url && (
                  <Image
                    src={note.url}
                    alt={note.title}
                    width={288}
                    height={288}
                  />
                )}
              </div>

              <Box className='flex justify-end'>
                <DisplayTooltip
                  title={createdAt}
                  content={formatDistanceToNow(date, { addSuffix: true })}
                />
              </Box>
            </div>
          );
        })}
      </Box>
    </div>
  );
}
