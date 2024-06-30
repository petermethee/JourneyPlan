import { Route, Routes, HashRouter as Router } from "react-router-dom";
import { ERouterPaths } from "./Helper/ERouterPaths";
import Home from "./Components/Home/Home";
import Alert from "./Components/Shared/Alert";
import { useAppSelector } from "./app/hooks";
import { selectSnackbarStatus } from "./features/Redux/tripSlice";
import { useEffect, useState } from "react";
import { AlertColor } from "@mui/material";
import AddTrip from "./Components/Home/AddTrip";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import Trip from "./Components/Trip/Trip";

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
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarState((prevState) => {
      return { ...prevState, open: false };
    });
  };

  useEffect(() => {
    if (snackbarStatus.message !== "") {
      setSnackbarState({
        open: true,
        severity: snackbarStatus.snackBarSeverity,
        message: snackbarStatus.message,
      });
    }
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
          <Route path={ERouterPaths.home} element={<Home />} />
          <Route path={ERouterPaths.addTrip} element={<AddTrip />} />
          <Route path={ERouterPaths.trip} element={<Trip />} />
        </Routes>
      </Router>
    </>
  );
}
