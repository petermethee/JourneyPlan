import React from "react";

import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import { Tooltip } from "@mui/material";

export default function AccomodationIcon({
  color,
  size,
}: {
  color?: string;
  size?: "small" | "large";
}) {
  return (
    <Tooltip title="Hébergement">
      <HotelRoundedIcon sx={{ color }} fontSize={size} />
    </Tooltip>
  );
}
