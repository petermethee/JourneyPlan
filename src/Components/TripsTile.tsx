import React from "react";
import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import styles from "./TripsTile.module.css";
import { ButtonBase } from "@mui/material";
import trip_bg from "../image/trip_bg.jpg";
import { lightSecondaryBlue } from "../style/cssGlobalStyle";

type TTileProps = {
  title: string;
  id: number;
  startDate: string;
  endDate: string;
  onClick: (id: number) => void;
  onEdit: (id: number) => void;
};
export default function TripsTile({
  title,
  id,
  startDate,
  endDate,
  onClick,
  onEdit,
}: TTileProps) {
  return (
    <div className={styles.card} onClick={() => onClick(id)}>
      <div
        style={{ backgroundImage: `url(${trip_bg})` }}
        className={styles.cardBg}
      />
      <ButtonBase
        className={styles.rippleEffect}
        sx={{ position: "absolute", color: "white", zIndex: 1 }}
      />
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.editIcon}>
          <IconButton
            sx={{ color: lightSecondaryBlue }}
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(id);
            }}
          >
            <EditRoundedIcon fontSize="small" />
          </IconButton>
        </div>
        <div>
          {startDate} - {endDate}
        </div>
      </div>
    </div>
  );
}
