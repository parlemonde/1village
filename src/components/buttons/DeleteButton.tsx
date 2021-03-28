import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';

import { Modal } from 'src/components/Modal';

interface DeleteButtonProps {
  size?: 'small' | 'medium';
  color?: 'primary' | 'secondary' | 'red';
  confirmLabel?: string;
  confirmTitle?: string;
  style?: React.CSSProperties;
  onDelete?(): void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    red: {
      backgroundColor: theme.palette.error.main,
      color: 'white',
      '&:hover': {
        backgroundColor: theme.palette.error.light,
      },
    },
    primary: {
      border: `1px solid ${theme.palette.primary.main}`,
    },
    secondary: {
      border: `1px solid ${theme.palette.secondary.main}`,
    },
  }),
);

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  size = 'small',
  color = 'primary',
  confirmLabel,
  confirmTitle,
  onDelete = () => {},
  style,
}: DeleteButtonProps) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const classes = useStyles();

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
        className={classes[color]}
        style={style}
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
