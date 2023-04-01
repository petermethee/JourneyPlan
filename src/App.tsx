import { Route, Routes, HashRouter as Router } from "react-router-dom";
import { routerPathes } from "./Helper/routerPathes";
import Home from "./Pages/Home";
import AddTrip from "./Pages/AddTrip";
import Alert from "./Components/Alert";
import { useAppSelector } from "./app/hooks";
import { selectSnackbarStatus } from "./features/Redux/JourneyPlanSlice";
import { useEffect, useState } from "react";
import { AlertColor } from "@mui/material";

const initialSnackState: {
  open: boolean;
  severity: AlertColor | undefined;
  message: string;
} = { open: false, severity: undefined, message: "" };

export default function App() {
  const snackbarStatus = useAppSelector(selectSnackbarStatus);
  const [snackbarState, setSnackbarState] = useState(initialSnackState);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarState(initialSnackState);
  };

  useEffect(() => {
    setSnackbarState({
      open: true,
      severity: snackbarStatus.snackBarSeverity,
      message: snackbarStatus.message,
    });
  }, [snackbarStatus]);

  return (
    <>
      <Alert
        open={snackbarState.open}
        handleClose={handleClose}
        message={snackbarState.message}
        severity={snackbarState.severity}
      />
      <Router>
        <Routes>
          <Route path={routerPathes.home} element={<Home />} />
          <Route
            path={routerPathes.planning + "/:tripId"}
            element={<div>yeah</div>}
          />
          <Route
            path={routerPathes.addTrip + "/:tripId?"}
            element={<AddTrip />}
          />
        </Routes>
      </Router>
    </>
  );
}
