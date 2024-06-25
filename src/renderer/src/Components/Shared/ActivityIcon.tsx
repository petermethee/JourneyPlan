import LandscapeRoundedIcon from "@mui/icons-material/LandscapeRounded";
import { Tooltip } from "@mui/material";

export default function ActivityIcon({
  color,
  size,
}: {
  color: string;
  size?: "small" | "large";
}) {
  return (
    <Tooltip title="Activité">
      <LandscapeRoundedIcon sx={{ color }} fontSize={size} />
    </Tooltip>
  );
}
