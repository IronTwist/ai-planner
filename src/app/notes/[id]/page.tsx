'use client';

import { notesRepository } from '@/app/repositories/notes';
import { blobRepository } from '@/app/repositories/vercel-blobs';
import { Canvas } from '@/modules/UI/components/canvas/canvas';
import { DisplayTooltip } from '@/modules/UI/components/molecules/display-tooltip';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Note } from '@/store/reducers/notes-slice';
import { AppDispatch } from '@/store/store';
import {
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { format, formatDistanceToNow } from 'date-fns';
import { RefObject, useEffect, useState } from 'react';
// import { FaICursor, FaPenFancy } from 'react-icons/fa6';
import { updateNote } from '@/store/reducers/notes-slice';

export default function NoteView() {
  const dispatch = useAppDispatch<AppDispatch>();
  const user = useAppSelector(state => state.auth.user);
  const notes = useAppSelector(state => state.notes.notes);
  const [note, setNote] = useState<Note | null>();
  const [noteCanvasUrl, setNoteCanvasUrl] = useState<string>('');
  const [contentType, setContentType] = useState<'text' | 'draw'>();
  const [createdAt, setCreatedAt] = useState<{
    date: Date;
    createdAt: string;
  }>();
  // const [canvasWidth, setCanvasWidth] = useState(0);
  // const [canvasHeight, setCanvasHeight] = useState(0);

  useEffect(() => {
    const urlId = window.location.pathname.split('/').pop();
    const getNoteFromState = notes?.find((note: Note) => note.id === urlId);
    setNote(getNoteFromState);
    setContentType(getNoteFromState?.content ? 'text' : 'draw');
  }, [notes]);

  console.log('note:', note);
  // function handleSave(canvasRef: RefObject<HTMLCanvasElement>): void {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas?.getContext('2d');
  //   if (canvas && ctx) {
  //     const dataUrl = canvas.toDataURL('image/jpeg');
  //     setNoteCanvasUrl(dataUrl);
  //   }
  // }

  const handleSave = async (canvasRef?: RefObject<HTMLCanvasElement>) => {
    // TODO fix save
    // 1. get image from url
    const image = new Image();
    image.src = noteCanvasUrl;

    await blobRepository.delete(note?.url);

    const newCanvas = document.createElement('canvas');
    newCanvas.width = canvasRef?.current?.width || 0;
    newCanvas.height = canvasRef?.current?.height || 0;

    const ctx = newCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(canvasRef?.current as HTMLCanvasElement, 0, 0);
    }

    newCanvas.toBlob(
      async blob => {
        const file = new File([blob as Blob], `${note?.id}-file.jpg`, {
          type: 'image/jpeg',
        });

        if (blob) {
          if (contentType === 'draw') {
            const response = await fetch(
              `/api/notes/upload?filename=${file.name}`,
              {
                method: 'POST',
                body: file,
              },
            );
            const fileUploadData = await response.json();

            if (fileUploadData) {
              const updatedNote = {
                ...note,
                url: fileUploadData.url,
              };

              const { data, error } = await notesRepository.updateNote(
                updatedNote as Note,
                user,
              );

              if (error) {
                console.log('error: ', error);
              }

              console.log('data-after-save: ', data);

              dispatch(updateNote(updatedNote as Note));
            }
          }
        }
      },
      'image/jpeg',
      0.95, // JPEG quality
    );
  };

  useEffect(() => {
    if (!note) return;
    const createdTimeStamp = note.createdAt;
    const date = new Date(createdTimeStamp);
    const createdAt = format(date, 'MMMM do, yyyy, h:mm:ss a');

    setCreatedAt({
      date,
      createdAt,
    });

    setNoteCanvasUrl(note?.url as string);
  }, [note]);

  useEffect(() => {}, [noteCanvasUrl?.length]);

  // useEffect(() => {
  //   // get width of window and displya modal on 90% of width
  //   const width = window.innerWidth;
  //   const height = window.innerHeight;
  //   const x = width * 0.9;
  //   const y = height * 0.9;
  //   setCanvasWidth(x);
  //   setCanvasHeight(y);
  // }, []);

  return (
    <div className='flex flex-col p-8 pt-16 mb-8 overflow-auto'>
      <Box
        sx={{
          padding: '1rem',
          borderRadius: '10px',
          backgroundColor: '#eee',
          userSelect: 'none',
          marginTop: '1rem',
        }}
      >
        <Box className='flex gap-2 w-full'>
          <Button variant='contained' onClick={() => window.history.back()}>
            Back
          </Button>
        </Box>
        <Divider orientation='horizontal' sx={{ my: '1rem' }} flexItem />
        <div className='flex justify-between items-center'>
          <Typography
            className='text-2xl font-bold items-center'
            sx={{ color: 'black', marginBottom: '1rem' }}
          >
            {note?.title || 'Untitled'}
          </Typography>
          <Box className='flex justify-end'>
            {createdAt && (
              <DisplayTooltip
                title={createdAt.createdAt}
                content={formatDistanceToNow(createdAt.date, {
                  addSuffix: true,
                })}
              />
            )}
          </Box>
        </div>
        <Stack style={{ height: '100%' }} spacing={2}>
          {/* <Box className='flex w-full justify-between'> */}
          {/* <Button
              sx={{
                width: 'auto',
                maxWidth: '12rem',
                height: '2rem',
                verticalAlign: 'center',
              }}
              size='medium'
              variant={contentType === 'text' ? 'contained' : 'outlined'}
              color='secondary'
              onClick={() =>
                // setContentType(contentType === 'text' ? 'draw' : 'text')
              }
            >
              {contentType === 'text' ? (
                <div className='flex gap-2 items-center'>
                  <FaPenFancy size={20} /> Pen mode
                </div>
              ) : (
                <div className='flex gap-2 items-center'>
                  <FaICursor size={20} /> Keyboard mode
                </div>
              )}
            </Button> */}
          {/* </Box> */}
          <Box
            style={{ width: '100%', height: '100%' }}
            className='flex flex-col space-x-2 gap-6 h-auto'
          >
            {contentType === 'text' && (
              <TextField
                label='Content'
                variant='outlined'
                fullWidth
                multiline
                rows={4}
                value={note?.content}
                placeholder='e.g. "Zen Mind, Beginners Mind" by Shunryu Suzuki'
                // onChange={e => setContent(e.target.value)}
                className='mb-4'
                sx={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            )}

            {contentType === 'draw' && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  paddingBottom: '1rem',
                }}
                className='flex flex-col bg-[#fff] text-black rounded-md gap-2 p-4 pb-0 justify-between shadow-[0_3px_6px_rgba(0,0,0,0.16),_0_3px_6px_rgba(0,0,0,0.23)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.25),_0_10px_10px_rgba(0,0,0,0.22)]'
              >
                {noteCanvasUrl?.length > 0 && (
                  <Canvas
                    loadContent={note?.url as string}
                    onSave={canvasRef => handleSave(canvasRef)}
                  />
                )}
              </div>
            )}
          </Box>
          {/* <Box
            className='flex justify-between space-x-2'
            sx={{ justifyContent: 'space-between' }}
          >
            {contentType === 'text' && (
              <Button
                variant='outlined'
                color='secondary'
                onClick={handleCancel}
                className='hover:bg-gray-100'
              >
                Cancel
              </Button>
            )}
            {contentType === 'text' && (
              <Button
                variant='contained'
                color='primary'
                onClick={() => handleSave()}
                className='bg-blue-500 hover:bg-blue-600 text-white gap-2'
              >
                <FaFileExport size={20} /> Save
              </Button>
            )}
          </Box> */}
        </Stack>
      </Box>
    </div>
  );
}
