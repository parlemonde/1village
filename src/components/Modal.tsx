import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import MuiDialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import type { LinearProgressProps } from '@mui/material/LinearProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import type { Theme as MaterialTheme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import type { WithStyles } from '@mui/styles';
import { createStyles, withStyles } from '@mui/styles';

import { RedButton } from 'src/components/buttons/RedButton';
import { bgPage } from 'src/styles/variables.const';

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const styles = (theme: MaterialTheme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });
export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  onClose: () => void;
}
const DialogTitle = withStyles(styles)((props: React.PropsWithChildren<DialogTitleProps>) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

interface ModalProps {
  open?: boolean;
  onClose?(): void;
  onConfirm?(): void;
  color?: 'primary' | 'secondary';
  ariaLabelledBy: string;
  ariaDescribedBy: string;
  noCloseButton?: boolean;
  title?: React.ReactNode | React.ReactNodeArray;
  actions?: React.ReactNode | React.ReactNodeArray;
  cancelLabel?: string;
  confirmLabel?: string;
  fullWidth?: boolean;
  maxWidth?: false | 'sm' | 'xs' | 'md' | 'lg' | 'xl';
  noCloseOutsideModal?: boolean;
  error?: boolean;
  disabled?: boolean;
  noTitle?: boolean;
  noCancelButton?: boolean;
  id?: string;
  loadingLabel?: string;
  loading?: boolean;
  progress?: number;
}

export const Modal: React.FC<ModalProps> = ({
  open = true,
  onClose = () => {},
  onConfirm = null,
  ariaLabelledBy,
  ariaDescribedBy,
  color = 'secondary',
  title = '',
  children = <div />,
  cancelLabel = '',
  confirmLabel = '',
  fullWidth = false,
  noCloseOutsideModal = false,
  maxWidth = 'sm',
  error = false,
  disabled = false,
  noCloseButton = false,
  noCancelButton = false,
  noTitle = false,
  loading = false,
  loadingLabel,
  progress,
  actions,
  id,
}: React.PropsWithChildren<ModalProps>) => {
  return (
    <Dialog
      open={open}
      onClose={noCloseOutsideModal ? () => {} : onClose}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      id={id}
    >
      {noTitle === false && (
        <DialogTitle id={ariaLabelledBy} onClose={noCloseButton ? undefined : onClose}>
          {title}
        </DialogTitle>
      )}
      <DialogContent
        style={{
          paddingTop: '16px',
          borderTop: noTitle ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
        }}
      >
        {children}
      </DialogContent>
      <DialogActions>
        {actions ? (
          actions
        ) : (
          <>
            {noCancelButton === false && (
              <Button onClick={onClose} color={color} variant="outlined">
                {cancelLabel || 'Annuler'}
              </Button>
            )}
            {onConfirm !== null && error && (
              <RedButton onClick={onConfirm} disabled={disabled} variant="contained">
                {confirmLabel || 'Oui'}
              </RedButton>
            )}
            {onConfirm !== null && !error && (
              <Button onClick={onConfirm} disabled={disabled} color={color} variant="contained">
                {confirmLabel || 'Non'}
              </Button>
            )}
          </>
        )}
      </DialogActions>
      {loading && (
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: bgPage,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {progress ? (
            <div style={{ width: '80%' }}>
              {loadingLabel && (
                <div className="text-center">
                  <span className="text text--primary">{loadingLabel}</span>
                </div>
              )}
              <LinearProgressWithLabel value={progress} />
            </div>
          ) : (
            <CircularProgress color="primary" />
          )}
        </div>
      )}
    </Dialog>
  );
};
