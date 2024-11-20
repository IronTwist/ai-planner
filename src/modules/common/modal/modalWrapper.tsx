'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useAppDispatch } from '@/store/hooks';
import { AppDispatch } from '@/store/store';
import { closeModal } from '@/store/reducers/modal-slice';

export type ModalWrapperType = {
  open: boolean;
  children: React.ReactNode;
};

export const ModalWrapper = ({ open, children }: ModalWrapperType) => {
  const dispatch = useAppDispatch<AppDispatch>();
  const handleClose = () => {
    //dispatch close modal
    dispatch(closeModal());
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        sx={{ height: '100%', overflow: 'scroll' }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '10px',
            boxShadow: 24,
            width: '90%',
            height: '50%',
          }}
        >
          {children}
        </Box>
      </Modal>
    </div>
  );
};
