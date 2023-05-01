import React from "react";
import styles from "./CalendarHeader.module.css";
import DayHeader from "./DayHeader";
import dayjs from "dayjs";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import { IconButton } from "@mui/material";

export default function CalendarHeader({ dayCols }: { dayCols: string[] }) {
  return (
    <div className={styles.daysHeader}>
      <div className={styles.settingsIcon}>
        <IconButton>
          <SettingsSuggestRoundedIcon />
        </IconButton>
      </div>

      {dayCols.map((date) => (
        <DayHeader key={date} date={dayjs(date)} />
      ))}
    </div>
  );
}
