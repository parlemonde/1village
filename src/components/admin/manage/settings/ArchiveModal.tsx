import React, { useState } from 'react';

import { TextField, Typography, Box } from '@mui/material';

import { Modal } from 'src/components/Modal';

interface ArchiveModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ArchiveModal({ open, onClose, onConfirm }: ArchiveModalProps) {
  const [confirmText, setConfirmText] = useState('');

  const handleConfirmTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmText(event.target.value);
  };

  const isConfirmDisabled = confirmText !== 'jeconfirmevousloirarchiver';

  return (
    <Modal
      open={open}
      noCloseButton={true}
      title="Attention !"
      onClose={onClose}
      onConfirm={onConfirm}
      confirmLabel="Archiver"
      cancelLabel="Annuler"
      color="primary"
      disabled={isConfirmDisabled}
      ariaLabelledBy="archive-modal-title"
      ariaDescribedBy="archive-modal-description"
    >
      <Box>
        <Typography id="archive-modal-description">
          Archiver 1Village supprimera l&apos;accès de tous les utilisateurs. C&apos;est une action à faire en fin d&apos;année. Merci d&apos;écrire
          &quot;jeconfirmevousloirarchiver&quot; dans l&apos;espace ci-dessous pour pouvoir effectuer l&apos;action.
        </Typography>
        <Box mt={2}>
          <TextField fullWidth placeholder="jeconfirmevousloirarchiver" value={confirmText} onChange={handleConfirmTextChange} />
        </Box>
      </Box>
    </Modal>
  );
}
