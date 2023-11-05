import React from "react";

import HotelRoundedIcon from "@mui/icons-material/HotelRounded";

export default function AccomodationIcon({
  color,
  size,
}: {
  color?: string;
  size?: "small" | "large";
}) {
  return <HotelRoundedIcon sx={{ color }} fontSize={size} />;
}
