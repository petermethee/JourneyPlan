import { Dispatch, SetStateAction } from "react";
import styles from "./CalendarHeader.module.css";
import DayHeader from "./DayHeader";
import dayjs from "dayjs";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { ButtonBase, IconButton } from "@mui/material";

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
    <div style={{ display: "flex" }}>
      <div className={styles.settingsIcon}>
        <IconButton>
          <SettingsSuggestRoundedIcon />
        </IconButton>
      </div>
      <div className={styles.daysHeader}>
        <ButtonBase
          sx={{ position: "absolute" }}
          className={styles.arrowButtonL}
          onClick={() =>
            setDaysIndex((prevState) => [prevState[0] - 1, prevState[1] - 1])
          }
          disabled={daysIndex[0] === 0}
        >
          <ArrowBackIosRoundedIcon />
        </ButtonBase>
        <ButtonBase
          sx={{ position: "absolute" }}
          onClick={() =>
            setDaysIndex((prevState) => [prevState[0] + 1, prevState[1] + 1])
          }
          disabled={dayCols.length === daysIndex[1]}
          className={styles.arrowButtonR}
        >
          <ArrowForwardIosRoundedIcon />
        </ButtonBase>

        {dayCols.map((date) => (
          <DayHeader key={date} date={dayjs(date)} />
        ))}
      </div>
    </div>
  );
}
