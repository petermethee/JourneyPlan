import LandscapeRoundedIcon from "@mui/icons-material/LandscapeRounded";
import { Tooltip } from "@mui/material";
import { activityColor } from "@renderer/style/cssGlobalStyle";

export default function ActivityIcon({
  color,
  size,
}: {
  color?: string;
  size?: "small" | "large";
}) {
  return (
    <Tooltip title="Activité">
      <LandscapeRoundedIcon
        sx={{ color: color ?? activityColor }}
        fontSize={size}
      />
    </Tooltip>
  );
}
