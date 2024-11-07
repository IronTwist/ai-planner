'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useAppDispatch } from '@/store/hooks';
import { AppDispatch } from '@/store/store';
import { closeModal } from '@/store/reducers/modal-slice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  border: '2px solid #000',
  borderRadius: '10px',
  boxShadow: 24,
};

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

  {
    console.log('modal is open', open, children);
  }
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>{children}</Box>
      </Modal>
    </div>
  );
};
