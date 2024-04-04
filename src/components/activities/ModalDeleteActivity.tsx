import React from 'react';

import { Modal, Typography, Paper, Button } from '@mui/material';

type Props = {
  isModalOpen: boolean;
  closeModal: React.Dispatch<React.SetStateAction<false>>;
};

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #ebebeb',
  boxShadow: 24,
  p: 4,
};

export default function ModalDeleteActivity({ isModalOpen, closeModal }: Props) {
  return (
    <Modal open={isModalOpen} onClose={closeModal} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Paper sx={style}>
        <h2 id="parent-modal-title">Text in a modal</h2>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
          <Button sx={{ margin: '0 10px' }} variant="contained">
            DELETE
          </Button>
          <Button sx={{ margin: '0 10px' }} variant="contained">
            CLOSE
          </Button>
        </div>
      </Paper>
    </Modal>
  );
}
