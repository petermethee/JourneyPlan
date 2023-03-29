import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { getAllTrips, selectTrips } from "./features/Redux/JourneyPlanSlice";
import { Route, Routes, HashRouter as Router } from "react-router-dom";
import { routerPathes } from "./Helper/routerPathes";
import Home from "./Pages/Home";

export default function App() {
  const dispatch = useAppDispatch();

  const trips = useAppSelector(selectTrips);
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
      </Routes>
    </Router>
  );
}
