import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";
import { getAllTrips } from "../API/TripsAPI";

export default function Home() {
  const onClick = () => {
    getAllTrips();
  };
  return (
    <Grid2>
      <button onClick={onClick}>Click</button>
    </Grid2>
  );
}
