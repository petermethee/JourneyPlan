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
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      sx={{ zIndex: 2001 }}
    >
      <MuiAlert
        variant="standard"
        onClose={handleClose}
        severity={severity}
        sx={{ width: "100%", boxShadow: "0 0 6px 0 #0000004b" }}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
}
