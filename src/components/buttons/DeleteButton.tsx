import React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import type { Theme } from '@mui/material/styles';

import { Modal } from 'src/components/Modal';

interface DeleteButtonProps {
  size?: 'small' | 'medium';
  color?: 'primary' | 'secondary' | 'red';
  confirmLabel?: string;
  confirmTitle?: string;
  style?: React.CSSProperties;
  onDelete?(): void;
}

const styles = {
  red: {
    backgroundColor: (theme: Theme) => theme.palette.error.main,
    color: 'white',
    '&:hover': {
      backgroundColor: (theme: Theme) => theme.palette.error.light,
    },
  },
  primary: {
    border: (theme: Theme) => `1px solid ${theme.palette.primary.main}`,
  },
  secondary: {
    border: (theme: Theme) => `1px solid ${theme.palette.secondary.main}`,
  },
};

export const DeleteButton = ({ size = 'small', color = 'primary', confirmLabel, confirmTitle, onDelete = () => {}, style }: DeleteButtonProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <>
      <IconButton
        onClick={() => {
          if (confirmLabel) {
            setIsModalOpen(true);
          } else {
            onDelete();
          }
        }}
        size={size}
        color={color === 'red' ? undefined : color}
        style={style}
        sx={styles[color]}
        aria-label="delete"
      >
        <DeleteIcon />
      </IconButton>
      <Modal
        open={isModalOpen}
        title={confirmTitle || 'Supprimer ?'}
        confirmLabel="Supprimer"
        onClose={() => {
          setIsModalOpen(false);
        }}
        onConfirm={() => {
          onDelete();
          setIsModalOpen(false);
        }}
        fullWidth
        maxWidth="sm"
        noCloseOutsideModal
        error
        ariaLabelledBy="confirm-delete-title"
        ariaDescribedBy="confirm-delete-desc"
      >
        <div id="confirm-delete-desc">{confirmLabel}</div>
      </Modal>
    </>
  );
};
