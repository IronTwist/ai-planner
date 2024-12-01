'use client';

import { notesRepository } from '@/app/repositories/notes';
import { blobRepository } from '@/app/repositories/vercel-blobs';
import { Canvas } from '@/modules/UI/components/canvas/canvas';
import { DisplayTooltip } from '@/modules/UI/components/molecules/display-tooltip';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Note, setLoading } from '@/store/reducers/notes-slice';
import { AppDispatch } from '@/store/store';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { format, formatDistanceToNow } from 'date-fns';
import { RefObject, useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { updateNote } from '@/store/reducers/notes-slice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSnackbar } from 'notistack';

export default function NoteView() {
  const dispatch = useAppDispatch<AppDispatch>();
  const user = useAppSelector(state => state.auth.user);
  const notes = useAppSelector(state => state.notes.notes);
  const loading = useAppSelector(state => state.notes.loading);
  const [note, setNote] = useState<Note | null>();
  const [noteCanvasUrl, setNoteCanvasUrl] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [createdAt, setCreatedAt] = useState<{
    date: Date;
    createdAt: string;
  }>();
  const [editTitleValue, setEditTitleValue] = useState<string>('');
  const [editContentValue, setEditContentValue] = useState<string>('');
  const { enqueueSnackbar } = useSnackbar();
  // const [canvasWidth, setCanvasWidth] = useState(0);
  // const [canvasHeight, setCanvasHeight] = useState(0);

  useEffect(() => {
    const urlId = window.location.pathname.split('/').pop();
    const getNoteFromState = notes?.find((note: Note) => note.id === urlId);
    setNote(getNoteFromState);
    setEditTitleValue(getNoteFromState?.title || '');
    setEditContentValue(getNoteFromState?.content || '');
  }, [notes]);

  const handleSave = async (canvasRef?: RefObject<HTMLCanvasElement>) => {
    dispatch(setLoading(true));

    await blobRepository.delete(note?.url);

    canvasRef?.current?.toBlob(
      async blob => {
        const file = new File([blob as Blob], `${note?.id}-file.jpg`, {
          type: 'image/jpeg',
        });
        if (blob) {
          if (editMode) {
            const response = await fetch(
              `/api/notes/upload?filename=${file.name}`,
              {
                method: 'POST',
                headers: {
                  'Access-Control-Allow-Origin': '*',
                },
                body: file,
              },
            );
            const fileUploadData = await response.json();
            if (fileUploadData) {
              const updatedNote = {
                ...note,
                url: fileUploadData.url,
                downloadUrl: fileUploadData.downloadUrl,
                pathname: fileUploadData.pathname,
                content: editContentValue,
                title: editTitleValue,
              };

              await notesRepository.updateNote(updatedNote as Note, user);

              dispatch(updateNote(updatedNote as Note));
              dispatch(setLoading(false));
              enqueueSnackbar('Update Note Successfully!', {
                variant: 'success',
              });
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

  useEffect(() => {}, [note, noteCanvasUrl?.length]);

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
        <Box className='flex gap-2 w-full justify-between'>
          <Button variant='contained' onClick={() => window.history.back()}>
            Back
          </Button>
          <Button
            sx={{
              width: 'auto',
              maxWidth: '12rem',
              height: '2rem',
              verticalAlign: 'center',
            }}
            size='medium'
            variant={!editMode ? 'contained' : 'outlined'}
            color='secondary'
            onClick={() => setEditMode(prev => !prev)}
          >
            {!editMode ? (
              <div className='flex gap-2 items-center'>
                <FaEdit size={20} /> Edit
              </div>
            ) : (
              <div className='flex gap-2 items-center'>
                <MdClose size={20} /> Exit
              </div>
            )}
          </Button>
        </Box>
        <Divider orientation='horizontal' sx={{ my: '1rem' }} flexItem />
        <div className='flex justify-between items-center'>
          <Typography
            className='text-3xl font-bold items-center'
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
          <Box
            style={{ width: '100%', height: '100%' }}
            className='flex flex-col space-x-2 gap-6 h-auto'
          >
            {editMode ? (
              <>
                <Accordion
                  className=' shadow-[0_1px_3px_rgba(0,0,0,0.12),_0_1px_2px_rgba(0,0,0,0.24)] transition duration-300 ease-in-out hover:shadow-[0_14px_28px_rgba(0,0,0,0.25),_0_5px_5px_rgba(0,0,0,0.22)]'
                  sx={{ width: '50%' }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1-content'
                    id='panel1-header'
                  >
                    Edit Title or Content
                  </AccordionSummary>
                  <AccordionDetails>
                    <TextField
                      label='Title'
                      variant='outlined'
                      fullWidth
                      value={editTitleValue}
                      placeholder='e.g. "Zen Mind, Beginners Mind" by Shunryu Suzuki'
                      onChange={e => setEditTitleValue(e.target.value)}
                      className='mb-4'
                      sx={{
                        width: '100%',
                        height: 'auto',
                      }}
                    />
                  </AccordionDetails>

                  <AccordionDetails>
                    <TextField
                      label='Content'
                      variant='outlined'
                      fullWidth
                      multiline
                      rows={4}
                      value={editContentValue}
                      placeholder='e.g. "Zen Mind, Beginners Mind" by Shunryu Suzuki'
                      onChange={e => setEditContentValue(e.target.value)}
                      className='mb-4'
                      sx={{
                        width: '100%',
                        height: 'auto',
                      }}
                    />
                  </AccordionDetails>
                </Accordion>
              </>
            ) : (
              <Box sx={{ color: 'black', whiteSpace: 'pre-wrap' }}>
                {note?.content}
              </Box>
            )}

            {editMode ? (
              <div
                style={{
                  height: '100%',
                  alignItems: 'center',
                  paddingBottom: '1rem',
                  marginLeft: 0,
                }}
                className='flex flex-col bg-[#fff] text-black rounded-md p-4 pb-0 justify-between shadow-[0_3px_6px_rgba(0,0,0,0.16),_0_3px_6px_rgba(0,0,0,0.23)] hover:shadow-[0_14px_28px_rgba(0,0,0,0.25),_0_10px_10px_rgba(0,0,0,0.22)]'
              >
                {noteCanvasUrl?.length > 0 && (
                  <Canvas
                    isSaving={loading}
                    loadContent={note?.url as string}
                    onSave={canvasRef => handleSave(canvasRef)}
                  />
                )}
              </div>
            ) : (
              <Box>
                {noteCanvasUrl?.length > 0 && (
                  <Canvas
                    editMode={false}
                    loadContent={note?.url as string}
                    onSave={canvasRef => handleSave(canvasRef)}
                  />
                )}
              </Box>
            )}
          </Box>
        </Stack>
      </Box>
    </div>
  );
}
