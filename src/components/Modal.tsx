import React from "react";

import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { createStyles, withStyles, WithStyles, Theme as MaterialTheme } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

import { RedButton } from "src/components/buttons/RedButton";

const styles = (theme: MaterialTheme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });
export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}
const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
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
  ariaLabelledBy: string;
  ariaDescribedBy: string;
  noCloseButton?: boolean;
  title?: string;
  children?: React.ReactNode | React.ReactNodeArray;
  cancelLabel?: string;
  confirmLabel?: string;
  fullWidth?: boolean;
  maxWidth?: false | "sm" | "xs" | "md" | "lg" | "xl";
  noCloseOutsideModal?: boolean;
  error?: boolean;
  disabled?: boolean;
}

export const Modal: React.FunctionComponent<ModalProps> = ({
  open = true,
  onClose = () => {},
  onConfirm = null,
  ariaLabelledBy,
  ariaDescribedBy,
  title = "",
  children = <div />,
  cancelLabel = "",
  confirmLabel = "",
  fullWidth = false,
  noCloseOutsideModal = false,
  maxWidth = "sm",
  error = false,
  disabled = false,
  noCloseButton = false,
}: ModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={noCloseOutsideModal ? () => {} : onClose}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle id={ariaLabelledBy} onClose={noCloseButton ? undefined : onClose}>
        {title}
      </DialogTitle>
      <DialogContent
        style={{
          paddingTop: "16px",
          borderTop: "1px solid rgba(0, 0, 0, 0.12)",
        }}
      >
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" variant="outlined">
          {cancelLabel || "Annuler"}
        </Button>
        {onConfirm !== null && error && (
          <RedButton onClick={onConfirm} disabled={disabled} variant="contained">
            {confirmLabel || "Oui"}
          </RedButton>
        )}
        {onConfirm !== null && !error && (
          <Button onClick={onConfirm} disabled={disabled} color="secondary" variant="contained">
            {confirmLabel || "Non"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
