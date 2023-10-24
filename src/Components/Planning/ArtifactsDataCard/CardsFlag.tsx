import React, { useMemo } from "react";
import styles from "./CardsFlag.module.css";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import SoupKitchenRoundedIcon from "@mui/icons-material/SoupKitchenRounded";
import FreeBreakfastRoundedIcon from "@mui/icons-material/FreeBreakfastRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Grid, Tooltip } from "@mui/material";
import {
  EEventStatus,
  TEventStatus,
  statusOptions,
} from "../../../Models/TEventStatus";

export default function CardsFlag({
  eventStatus,
  mealStatus,
}: {
  mealStatus?: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  eventStatus?: TEventStatus;
}) {
  const icons = useMemo(() => {
    if (mealStatus) {
      const oneMeal = Object.values(mealStatus!).some((val) => val);
      return (
        <RestaurantRoundedIcon
          sx={{ fontSize: "14px", color: oneMeal ? "#fff" : "#ffffff69" }}
        />
      );
    } else {
      return statusOptions[eventStatus!]?.icon("#ffffff");
    }
  }, [mealStatus, eventStatus]);

  const tooltip = useMemo(() => {
    if (mealStatus) {
      return (
        <Grid container gap={2}>
          <Grid
            item
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <FreeBreakfastRoundedIcon sx={{ fontSize: "14px" }} />
            {mealStatus?.breakfast ? (
              <CheckRoundedIcon sx={{ fontSize: "10px" }} />
            ) : (
              <CloseRoundedIcon sx={{ fontSize: "10px" }} />
            )}
          </Grid>
          <Grid
            item
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <RestaurantRoundedIcon sx={{ fontSize: "14px" }} />
            {mealStatus?.lunch ? (
              <CheckRoundedIcon sx={{ fontSize: "10px" }} />
            ) : (
              <CloseRoundedIcon sx={{ fontSize: "10px" }} />
            )}
          </Grid>
          <Grid
            item
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <SoupKitchenRoundedIcon sx={{ fontSize: "14px" }} />
            {mealStatus?.dinner ? (
              <CheckRoundedIcon sx={{ fontSize: "10px" }} />
            ) : (
              <CloseRoundedIcon sx={{ fontSize: "10px" }} />
            )}
          </Grid>
        </Grid>
      );
    } else {
      return (
        <div style={{ fontSize: "11px" }}>
          {statusOptions[eventStatus!]?.text}
        </div>
      );
    }
  }, [mealStatus, eventStatus]);

  return (
    <div className={styles.cardFlagContainer}>
      <BookmarkRoundedIcon
        fontSize="large"
        className={styles.bookmark}
        sx={{
          color: mealStatus ? "#bd9741bd" : statusOptions[eventStatus!]?.color,
        }}
      />
      <Tooltip title={tooltip}>
        <div className={styles.absoluteContainer}>
          <div>{icons}</div>
        </div>
      </Tooltip>
    </div>
  );
}
