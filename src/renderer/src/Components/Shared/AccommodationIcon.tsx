import HotelRoundedIcon from "@mui/icons-material/HotelRounded";
import { Tooltip } from "@mui/material";
import { accommodationColor } from "@renderer/style/cssGlobalStyle";

export default function AccommodationIcon({
  color,
  size,
}: {
  color?: string;
  size?: "small" | "large";
}) {
  return (
    <Tooltip title="Hébergement">
      <HotelRoundedIcon
        sx={{ color: color ?? accommodationColor }}
        fontSize={size}
      />
    </Tooltip>
  );
}
