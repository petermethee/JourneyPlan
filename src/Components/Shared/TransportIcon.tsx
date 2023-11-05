import React from "react";
import TrainRoundedIcon from "@mui/icons-material/TrainRounded";

export default function TransportIcon({
  color,
  size,
}: {
  color: string;
  size?: "small" | "large";
}) {
  return <TrainRoundedIcon sx={{ color }} fontSize={size} />;
}
