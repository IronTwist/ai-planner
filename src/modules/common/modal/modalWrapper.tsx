'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { AppDispatch } from '@/store/store';
import { closeModal } from '@/store/reducers/modal-slice';

export type ModalWrapperType = {
  disableBackdropClick?: boolean;
  open: boolean;
  children: React.ReactNode;
};

export const ModalWrapper = ({ open, children }: ModalWrapperType) => {
  const modalName = useAppSelector(state => state.modal.name);

  const dispatch = useAppDispatch<AppDispatch>();
  const handleClose = () => {
    if (modalName === 'addNoteModal') {
      return;
    }

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
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '10px',
            boxShadow: 24,
            width: 'auto',
            height: '30%',
          }}
        >
          {children}
        </Box>
      </Modal>
    </div>
  );
};
