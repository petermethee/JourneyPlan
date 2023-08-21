import React, { Dispatch, SetStateAction } from "react";
import styles from "./CalendarHeader.module.css";
import DayHeader from "./DayHeader";
import dayjs from "dayjs";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { IconButton } from "@mui/material";

export default function CalendarHeader({
  dayCols,
  daysIndex,
  setDaysIndex,
}: {
  dayCols: string[];
  daysIndex: number[];
  setDaysIndex: Dispatch<SetStateAction<number[]>>;
}) {
  return (
    <div className={styles.daysHeader}>
      <div className={styles.settingsIcon}>
        <IconButton>
          <SettingsSuggestRoundedIcon />
        </IconButton>
      </div>
      <div className={styles.arrowButtonL}>
        <IconButton
          onClick={() =>
            setDaysIndex((prevState) => [prevState[0] - 1, prevState[1] - 1])
          }
          disabled={daysIndex[0] === 0}
        >
          <ArrowBackIosRoundedIcon />
        </IconButton>
      </div>
      <div className={styles.arrowButtonR}>
        <IconButton
          onClick={() =>
            setDaysIndex((prevState) => [prevState[0] + 1, prevState[1] + 1])
          }
          disabled={dayCols.length === daysIndex[1]}
        >
          <ArrowForwardIosRoundedIcon />
        </IconButton>
      </div>

      {dayCols.map((date) => (
        <DayHeader key={date} date={dayjs(date)} />
      ))}
    </div>
  );
}
