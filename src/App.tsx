import React, { useEffect } from "react";
import { useAppDispatch } from "./app/hooks";
import { getAllTrips } from "./features/Redux/JourneyPlanSlice";
import { Route, Routes, HashRouter as Router } from "react-router-dom";
import { routerPathes } from "./Helper/routerPathes";
import Home from "./Pages/Home";
import AddTrip from "./Pages/AddTrip";

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllTrips());
  }, [dispatch]);
  return (
    <Router>
      <Routes>
        <Route path={routerPathes.home} element={<Home />} />
        <Route
          path={routerPathes.planning + "/:tripId"}
          element={<div>yeah</div>}
        />
        <Route path={routerPathes.addTrip} element={<AddTrip />} />
      </Routes>
    </Router>
  );
}
