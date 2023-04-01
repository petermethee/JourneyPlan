import React from "react";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";

export default function Alert({
  open,
  message,
  severity,
  handleClose,
}: {
  open: boolean;
  message: string;
  severity: AlertColor | undefined;
  handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
}) {
  return (
    <>
      {open && (
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
          sx={{ zIndex: 2001 }}
        >
          <MuiAlert
            onClose={handleClose}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {message}
          </MuiAlert>
        </Snackbar>
      )}
    </>
  );
}
