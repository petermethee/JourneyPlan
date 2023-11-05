import React from "react";
import LandscapeRoundedIcon from "@mui/icons-material/LandscapeRounded";

export default function ActivityIcon({
  color,
  size,
}: {
  color: string;
  size?: "small" | "large";
}) {
  return <LandscapeRoundedIcon sx={{ color }} fontSize={size} />;
}
