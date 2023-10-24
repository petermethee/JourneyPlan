import React, { useMemo } from "react";
import styles from "./CardsFlag.module.css";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import SoupKitchenRoundedIcon from "@mui/icons-material/SoupKitchenRounded";
import FreeBreakfastRoundedIcon from "@mui/icons-material/FreeBreakfastRounded";
import RestaurantRoundedIcon from "@mui/icons-material/RestaurantRounded";
import CreditScoreRoundedIcon from "@mui/icons-material/CreditScoreRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Grid, Tooltip } from "@mui/material";

export default function CardsFlag({
  eventStatus,
  mealStatus,
}: {
  mealStatus?: {
    lunch: boolean;
    breakfast: boolean;
    dinner: boolean;
  };
  eventStatus?: "paid" | "reserved" | null;
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
      return (
        <>
          {eventStatus === "paid" ? (
            <CreditScoreRoundedIcon sx={{ fontSize: "14px", color: "#fff" }} />
          ) : eventStatus === "reserved" ? (
            <EventAvailableRoundedIcon
              sx={{ fontSize: "14px", color: "#fff" }}
            />
          ) : (
            <EventBusyRoundedIcon sx={{ fontSize: "14px", color: "#fff" }} />
          )}
        </>
      );
    }
  }, [mealStatus]);

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
      return <div style={{ fontSize: "11px" }}> {eventStatus}</div>;
    }
  }, [mealStatus, eventStatus]);

  return (
    <div className={styles.cardFlagContainer}>
      <BookmarkRoundedIcon
        color="secondary"
        fontSize="large"
        className={styles.bookmark}
      />
      <Tooltip title={tooltip}>
        <div className={styles.absoluteContainer}>
          <div>{icons}</div>
        </div>
      </Tooltip>
    </div>
  );
}
