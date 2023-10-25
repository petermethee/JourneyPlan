import React, { useMemo } from "react";
import styles from "./CardsFlag.module.css";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Grid, Tooltip } from "@mui/material";
import { EEventStatus, statusOptions } from "../../../Models/EEventStatus";
import { meals } from "../../../Helper/MealsHelper";

export default function CardsFlag({
  eventStatus,
  mealStatus,
}: {
  mealStatus?: {
    breakfast: 0 | 1;
    lunch: 0 | 1;
    dinner: 0 | 1;
  };
  eventStatus?: EEventStatus;
}) {
  const icons = useMemo(() => {
    if (mealStatus) {
      const oneMeal = Object.values(mealStatus!).some((val) => val);
      return meals.lunch.icon(oneMeal ? "#ffffff" : "#ffffff70");
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
            {meals.breakfast.icon()}
            {mealStatus?.breakfast === 1 ? (
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
            {meals.lunch.icon()}

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
            {meals.dinner.icon()}
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
        className={styles.bookmark}
        sx={{
          color: mealStatus ? "#bd9741bd" : statusOptions[eventStatus!]?.color,
          fontSize: "28px",
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
