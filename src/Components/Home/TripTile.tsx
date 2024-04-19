import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import styles from "./TripsTile.module.css";
import { ButtonBase } from "@mui/material";
import { primaryColor, secErrorColor } from "../../style/cssGlobalStyle";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { ERouterPaths } from "../../Helper/ERouterPaths";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ITrip from "../../Models/ITrip";
import { useAppDispatch } from "../../app/hooks";
import { deleteTrip, setCurrentTrip } from "../../features/Redux/tripSlice";

require("dayjs/locale/fr");

export default function TripTile({ trip }: { trip: ITrip }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <div
      className={styles.cardContainer}
      onClick={() => {
        dispatch(setCurrentTrip(trip));
        navigate(ERouterPaths.planning + "/" + trip.id);
      }}
    >
      <ButtonBase
        className={styles.rippleEffect}
        sx={{ position: "absolute", color: "white", zIndex: 1 }}
      />
      <img
        src={trip.image_path ?? "images/trip_picture/trip_bg.jpg"}
        alt={`Trip`}
        className={styles.cardBg}
      />

      <div className={styles.content}>
        <div className={styles.title}>{trip.name}</div>
        <div className={styles.delete}>
          <IconButton
            sx={{
              backgroundColor: "#ffffff82",
              "&:hover": { backgroundColor: "#a3a3a3bb" },
            }}
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              dispatch(deleteTrip(trip.id));
            }}
          >
            <DeleteRoundedIcon fontSize="small" sx={{ color: secErrorColor }} />
          </IconButton>
        </div>
        <div className={styles.editIcon}>
          <IconButton
            sx={{
              backgroundColor: "#ffffff82",
              "&:hover": { backgroundColor: "#a3a3a3bb" },
            }}
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              dispatch(setCurrentTrip(trip));
              navigate(`${ERouterPaths.addTrip}`);
            }}
          >
            <EditRoundedIcon sx={{ color: primaryColor }} fontSize="small" />
          </IconButton>
        </div>

        <div>
          {dayjs(trip.start_date)
            .locale("fr")
            .format("DD MMM YYYY")
            .toUpperCase()}{" "}
          -{" "}
          {dayjs(trip.end_date)
            .locale("fr")
            .format("DD MMM YYYY")
            .toUpperCase()}
        </div>
      </div>
    </div>
  );
}
