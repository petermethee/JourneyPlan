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
  nbDays,
}: {
  dayCols: string[];
  daysIndex: number[];
  setDaysIndex: Dispatch<SetStateAction<number[]>>;
  nbDays: number;
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
          className={styles.arrowButtonL}
          sx={{
            position: "absolute",
            borderRadius: "0 50% 50% 0",
            backgroundColor: "#ffffff1f",
            opacity: daysIndex[0] === 0 ? 0 : 1,
          }}
          onClick={() =>
            setDaysIndex((prevState) => [prevState[0] - 1, prevState[1] - 1])
          }
          disabled={daysIndex[0] === 0}
        >
          <ArrowBackIosRoundedIcon sx={{ color: "white" }} />
        </ButtonBase>
        <ButtonBase
          className={styles.arrowButtonR}
          sx={{
            position: "absolute",
            borderRadius: "50% 0 0 50%",
            backgroundColor: "#ffffff1f",
            opacity: nbDays === daysIndex[1] ? 0 : 1,
          }}
          onClick={() =>
            setDaysIndex((prevState) => [prevState[0] + 1, prevState[1] + 1])
          }
          disabled={nbDays === daysIndex[1]}
        >
          <ArrowForwardIosRoundedIcon sx={{ color: "white" }} />
        </ButtonBase>

        {dayCols.map((date, index) => (
          <DayHeader
            key={date}
            date={dayjs(date)}
            isEven={(daysIndex[0] + index) % 2 === 0}
          />
        ))}
      </div>
    </div>
  );
}
