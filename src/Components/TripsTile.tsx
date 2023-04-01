import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import styles from "./TripsTile.module.css";
import { ButtonBase } from "@mui/material";
import trip_bg from "../image/trip_bg.jpg";
import { primaryColor } from "../style/cssGlobalStyle";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { routerPathes } from "../Helper/routerPathes";
require("dayjs/locale/fr");
type TTileProps = {
  title: string;
  id: number;
  startDate: string;
  endDate: string;
  imagePath: string;
  onClick: (id: number) => void;
};
export default function TripsTile({
  title,
  id,
  startDate,
  endDate,
  imagePath,
  onClick,
}: TTileProps) {
  let background;
  try {
    background = require(`../image/${imagePath}`);
  } catch (error) {
    background = trip_bg;
  }
  const navigate = useNavigate();
  return (
    <div className={styles.card} onClick={() => onClick(id)}>
      <img src={background} alt={`url(${trip_bg})`} className={styles.cardBg} />
      <ButtonBase
        className={styles.rippleEffect}
        sx={{ position: "absolute", color: "white", zIndex: 1 }}
      />
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.editIcon}>
          <IconButton
            sx={{ backgroundColor: "#ffffff82" }}
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              navigate(`${routerPathes.addTrip}/${id}`);
            }}
          >
            <EditRoundedIcon sx={{ color: primaryColor }} fontSize="small" />
          </IconButton>
        </div>
        <div>
          {dayjs(startDate).locale("fr").format("DD MMM YYYY").toUpperCase()} -{" "}
          {dayjs(endDate).locale("fr").format("DD MMM YYYY").toUpperCase()}
        </div>
      </div>
    </div>
  );
}
