import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/reducers/modal-slice';
import { addNote } from '@/store/reducers/notes-slice';
import { AppDispatch } from '@/store/store';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { RefObject, useEffect, useState } from 'react';
import { Canvas } from './../../UI/components/canvas/canvas';
import { FaFileExport, FaICursor, FaPenFancy } from 'react-icons/fa6';
import { generateUniqueId } from '@/utils';

export const AddNoteModal = () => {
  const dispatch = useAppDispatch<AppDispatch>();
  const user = useAppSelector(state => state.auth.user);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<'draw' | 'text'>('draw');
  // const [canvasWidth, setCanvasWidth] = useState(0);
  // const [canvasHeight, setCanvasHeight] = useState(0);
  // const [isErasing, setIsErasing] = useState(false);

  const handleSave = async (canvasRef?: RefObject<HTMLCanvasElement>) => {
    const noteId = generateUniqueId();

    const resp = await fetch(`/api/store/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({
        noteId,
        title,
        content,
        userId: user?.uid,
      }),
    });

    const { data, error } = await resp.json();

    // TODO: handle error later
    if (data) {
      canvasRef?.current?.toBlob(
        async blob => {
          const file = new File([blob as Blob], `${noteId}-file.jpg`, {
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
                // Update the note with the file URL
                const updateResponse = await fetch(`/api/store/notes`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`,
                  },
                  body: JSON.stringify({
                    noteId: data.noteRef._path.segments[3],
                    title,
                    content,
                    userId: user?.uid,
                    downloadUrl: fileUploadData.downloadUrl,
                    pathname: fileUploadData.pathname,
                    url: fileUploadData.url,
                  }),
                });

                await updateResponse.json();

                dispatch(
                  addNote({
                    ...data,
                    downloadUrl: fileUploadData.downloadUrl,
                    pathname: fileUploadData.pathname,
                    url: fileUploadData.url,
                  }),
                );
                dispatch(closeModal());
              }
            }
          }
        },
        'image/jpeg',
        0.95, // JPEG quality
      );

      dispatch(
        addNote({
          ...data,
        }),
      );
      dispatch(closeModal());
    } else {
      console.log('An error occurred', error);
      dispatch(closeModal());
    }

    setTitle('');
    setContent('');
  };

  const handleCancel = () => {
    dispatch(closeModal());
    setTitle('');
    setContent('');
  };

  useEffect(() => {
    // get width of window and displya modal on 90% of width
    // const width = window.innerWidth;
    // const height = window.innerHeight;
    // const x = width * 0.9;
    // const y = height * 0.9;
    // setCanvasWidth(x);
    // setCanvasHeight(y);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        padding: '1rem',
        borderRadius: '10px',
        backgroundColor: '#fff',
        userSelect: 'none',
        overflowx: 'hidden',
      }}
    >
      <Typography
        className='text-2xl font-bold'
        sx={{ color: 'black', marginBottom: '1rem' }}
      >
        New note
      </Typography>
      <Stack spacing={2}>
        <Box className='flex w-full justify-between gap-2'>
          <TextField
            label='Title here'
            variant='outlined'
            fullWidth
            value={title}
            onChange={e => setTitle(e.target.value)}
            className='mb-4 text-yellow-50'
            placeholder='e.g., My book list'
            size='small'
            sx={{
              borderRadius: '10px',
              color: 'white',
              width: '20rem',
            }}
          />
          <div className='flex flex-col gap-2'>
            <Button
              sx={{
                width: 'auto',
                maxWidth: '12rem',
                height: '2rem',
                verticalAlign: 'center',
              }}
              size='medium'
              disabled={contentType !== 'text'}
              variant={contentType === 'text' ? 'contained' : 'outlined'}
              color='secondary'
              onClick={() =>
                setContentType(contentType === 'text' ? 'draw' : 'text')
              }
            >
              <div className='flex gap-2 items-center'>
                <FaPenFancy size={20} /> Pen mode
              </div>
            </Button>
            <Button
              sx={{
                width: 'auto',
                maxWidth: '12rem',
                height: '2rem',
                verticalAlign: 'center',
              }}
              size='medium'
              disabled={contentType !== 'draw'}
              variant={contentType === 'draw' ? 'contained' : 'outlined'}
              color='secondary'
              onClick={() =>
                setContentType(contentType === 'text' ? 'draw' : 'text')
              }
            >
              <div className='flex gap-2 items-center'>
                <FaICursor size={20} /> Keyboard mode
              </div>
            </Button>
          </div>
        </Box>
        <Box className='flex flex-col gap-6'>
          {contentType === 'text' && (
            <TextField
              label='Content'
              variant='outlined'
              fullWidth
              multiline
              rows={4}
              value={content}
              placeholder='e.g. "Zen Mind, Beginners Mind" by Shunryu Suzuki'
              onChange={e => setContent(e.target.value)}
              className='mb-4'
              sx={{
                // width: canvasWidth - 35,
                height: 'auto',
              }}
            />
          )}
          {contentType === 'draw' && (
            <Box className='flex w-full justify-between'>
              <Button
                variant='outlined'
                color='secondary'
                onClick={handleCancel}
                className='hover:bg-gray-100'
              >
                Cancel
              </Button>
            </Box>
          )}

          {contentType === 'draw' && (
            <div
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                paddingBottom: '1rem',
              }}
            >
              <Canvas onSave={canvasRef => handleSave(canvasRef)} />
            </div>
          )}
        </Box>
        <Box
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
        </Box>
      </Stack>
    </Box>
  );
};
