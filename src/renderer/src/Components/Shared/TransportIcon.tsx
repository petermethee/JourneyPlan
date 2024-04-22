import React from "react";
import TrainRoundedIcon from "@mui/icons-material/TrainRounded";
import { Tooltip } from "@mui/material";

export default function TransportIcon({
  color,
  size,
}: {
  color: string;
  size?: "small" | "large";
}) {
  return (
    <Tooltip title="Transport">
      <TrainRoundedIcon sx={{ color }} fontSize={size} />
    </Tooltip>
  );
}
