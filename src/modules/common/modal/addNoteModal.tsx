import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { closeModal } from '@/store/reducers/modal-slice';
import { addNote } from '@/store/reducers/notes-slice';
import { AppDispatch } from '@/store/store';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Canvas } from './../../UI/components/canvas/canvas';

export const AddNoteModal = () => {
  const dispatch = useAppDispatch<AppDispatch>();
  const user = useAppSelector(state => state.auth.user);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = async () => {
    const resp = await fetch(`/api/store/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({
        title,
        content,
        userId: user?.uid,
      }),
    });

    const { data, error } = await resp.json();

    console.log('add note data: ', data);

    // TODO: handle error later
    if (data) {
      dispatch(addNote({ ...data }));
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

  return (
    <Box
      sx={{
        width: 'auto',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '10px',
        backgroundColor: '#fff',
      }}
    >
      <Typography
        className='text-2xl font-bold'
        sx={{ color: 'black', marginBottom: '2rem' }}
      >
        Add Note
      </Typography>
      <Stack spacing={2}>
        <TextField
          label='Title'
          variant='outlined'
          fullWidth
          value={title}
          onChange={e => setTitle(e.target.value)}
          className='mb-4 text-yellow-50'
          placeholder='Enter title'
          sx={{
            border: '1px solid #ccc',
            borderRadius: '10px',
            color: 'white',
          }}
        />

        <TextField
          label='Content'
          variant='outlined'
          fullWidth
          multiline
          rows={4}
          value={content}
          placeholder='e.g. Take notes...'
          onChange={e => setContent(e.target.value)}
          className='mb-4'
        />

        <Canvas width={340} height={280} />

        <Box
          className='flex justify-between space-x-2'
          sx={{ justifyContent: 'space-between' }}
        >
          <Button
            variant='outlined'
            color='secondary'
            onClick={handleCancel}
            className='hover:bg-gray-100'
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={handleSave}
            className='bg-blue-500 hover:bg-blue-600 text-white'
          >
            Save
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
