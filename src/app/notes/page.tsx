'use client';

import { DisplayTooltip } from '@/modules/UI/components/molecules/display-tooltip';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logOut } from '@/store/reducers/auth-slice';
import { openModal } from '@/store/reducers/modal-slice';
import { Note, setNotes } from '@/store/reducers/notes-slice';
import { AppDispatch } from '@/store/store';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { format, formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaRegTrashCan, FaCirclePlus, FaDownload } from 'react-icons/fa6';
import { notesRepository } from '../repositories/notes';
import Image from 'next/image';
import { blobRepository } from '../repositories/vercel-blobs';

export default function Notes() {
  const dispatch = useAppDispatch<AppDispatch>();
  const notes = useAppSelector(state => state.notes.notes);
  const [fetchedNotes, setFetchedNotes] = useState<Note[]>(notes);
  const user = useAppSelector(state => state.auth.user);
  const router = useRouter();
  const [focusNote, setFocusNote] = useState<string>('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState<{
    id?: string;
    open?: boolean;
  }>({
    id: '',
    open: false,
  });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleAddNote = () => {
    dispatch(openModal({ name: 'addNoteModal' }));
  };

  const openConfirmDeleteDialog = (id: string) => {
    setDeleteDialogOpen({ id, open: true });
  };

  const handleCloseDeleteDialogConfirm = () => {
    setDeleteDialogOpen({ open: false });
    handleDeleteNote(deleteDialogOpen.id as string);
  };

  const handleCloseDeleteDialogCancel = () => {
    setDeleteDialogOpen({ open: false });
  };

  const handleDeleteNote = (id: string) => {
    // const alertAnswer = window.confirm(
    //   'Are you sure you want to delete this note?',
    // );

    blobRepository.delete(fetchedNotes.find(note => note.id === id)?.url);

    notesRepository.deleteNote(id, user).then(data => {
      setFetchedNotes(fetchedNotes.filter(note => note.id !== id));
      dispatch(setNotes({ notes: data, loading: false, error: null }));
    });
  };

  const handleNoteFocus = (id: string) => {
    setFocusNote(id);
  };

  const viewNote = (note: Note) => {
    router.push(`${window.location.origin}/notes/${note.id}`);
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
    <div className='flex flex-col pt-10 overflow-hidden'>
      <Box className='NoteTable flex bg-cover bg-[url("/images/aaabstract.webp")] bg-repeat h-[80%] p-7 mt-7 gap-6 flex-wrap justify-center'>
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
              className='flex flex-col w-[288px] h-72 bg-[#fff] text-black rounded-md gap-2 p-4 pb-0 justify-between shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)] transition duration-300 ease-in-out hover:shadow-[0_14px_28px_rgba(0,0,0,0.25),_0_10px_10px_rgba(0,0,0,0.22)]'
              key={note.id}
              style={{ userSelect: 'none' }}
              onMouseOver={() => handleNoteFocus(note.id)}
              onPointerEnter={() => handleNoteFocus(note.id)}
            >
              <div className='flex justify-between hover:cursor-pointer'>
                <h2 className='font-bold' onClick={() => viewNote(note)}>
                  {note.title ? note.title : 'Untitled'}
                </h2>

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
                      onClick={() => openConfirmDeleteDialog(note.id)}
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
                    className='cursor-pointer'
                    src={note.url}
                    alt={note.title}
                    width={288}
                    height={288}
                    onClick={() => viewNote(note)}
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
      <Dialog
        fullScreen={fullScreen}
        open={deleteDialogOpen.open as boolean}
        onClose={handleCloseDeleteDialogCancel}
        aria-labelledby='responsive-dialog-title'
      >
        <DialogTitle variant='h5' id='responsive-dialog-title'>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this note?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDeleteDialogCancel}>
            Cance
          </Button>
          <Button onClick={handleCloseDeleteDialogConfirm} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
