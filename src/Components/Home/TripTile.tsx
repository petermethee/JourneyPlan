import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import styles from "./TripsTile.module.css";
import { ButtonBase } from "@mui/material";
import { primaryColor, secErrorColor } from "../../style/cssGlobalStyle";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { ERouterPathes } from "../../Helper/ERouterPathes";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

require("dayjs/locale/fr");

type TTileProps = {
  title: string;
  id: number;
  startDate: string;
  endDate: string;
  imagePath: string | null;
  onClick: (id: number) => void;
  onDelete: () => void;
};
export default function TripTile({
  title,
  id,
  startDate,
  endDate,
  imagePath,
  onDelete,
  onClick,
}: TTileProps) {
  const navigate = useNavigate();

  return (
    <div className={styles.cardContainer} onClick={() => onClick(id)}>
      <ButtonBase
        className={styles.rippleEffect}
        sx={{ position: "absolute", color: "white", zIndex: 1 }}
      />
      <img
        src={
          process.env.REACT_APP_TRIP_PICTURE +
          "/" +
          (imagePath ?? "trip_bg.jpg")
        }
        alt={`Trip`}
        className={styles.cardBg}
      />

      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.delete}>
          <IconButton
            sx={{ backgroundColor: "#ffffff82" }}
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
          >
            <DeleteRoundedIcon fontSize="small" sx={{ color: secErrorColor }} />
          </IconButton>
        </div>
        <div className={styles.editIcon}>
          <IconButton
            sx={{ backgroundColor: "#ffffff82" }}
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              navigate(`${ERouterPathes.addTrip}/${id}`);
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
