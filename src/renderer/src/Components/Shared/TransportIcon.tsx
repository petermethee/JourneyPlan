import TrainRoundedIcon from "@mui/icons-material/TrainRounded";
import { Tooltip } from "@mui/material";
import { transportColor } from "@renderer/style/cssGlobalStyle";

export default function TransportIcon({
  color,
  size,
}: {
  color?: string;
  size?: "small" | "large";
}) {
  return (
    <Tooltip title="Transport">
      <TrainRoundedIcon
        sx={{ color: color ?? transportColor }}
        fontSize={size}
      />
    </Tooltip>
  );
}
