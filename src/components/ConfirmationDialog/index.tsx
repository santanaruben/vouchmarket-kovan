import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import React from "react";
import { useTranslation } from "react-i18next";

export interface ConfirmationDialogProps {
  content: string;
  open: boolean;
  onClose: (willProceed: boolean) => void;
}

function ConfirmationDialog({
  content,
  open,
  onClose,
}: ConfirmationDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">
        {t("dialog.confirm")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="confirmation-dialog-description"
          style={{ whiteSpace: "pre-line" }}
        >
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} color="primary">
          {t("dialog.cancel")}
        </Button>
        <Button onClick={() => onClose(true)} color="primary" autoFocus>
          {t("dialog.proceed")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;
