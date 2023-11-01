import { Dispatch, SetStateAction } from "react";
import styles from "./CalendarHeader.module.css";
import DayHeader from "./DayHeader";
import dayjs from "dayjs";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { ButtonBase, IconButton } from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useNavigate } from "react-router-dom";
import { ERouterPathes } from "../../../Helper/ERouterPathes";

const dayShift = 3;

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
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex" }}>
      <div className={styles.settingsIcon}>
        <IconButton onClick={() => navigate(ERouterPathes.pdf)}>
          <PictureAsPdfIcon />
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
            setDaysIndex((prevState) => {
              const offset = Math.min(dayShift, prevState[0]);
              return [prevState[0] - offset, prevState[1] - offset];
            })
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
            setDaysIndex((prevState) => {
              const offset = Math.min(dayShift, nbDays - prevState[1]);
              return [prevState[0] + offset, prevState[1] + offset];
            })
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
