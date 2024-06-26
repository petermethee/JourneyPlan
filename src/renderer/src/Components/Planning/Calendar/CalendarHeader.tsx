import { Dispatch, SetStateAction } from "react";
import styles from "./CalendarHeader.module.css";
import DayHeader from "./DayHeader";
import dayjs from "dayjs";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import {
  ButtonBase,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIconRounded from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";
import { ERouterPaths } from "../../../Helper/ERouterPaths";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  exportAttachments,
  selectPlanningId,
} from "../../../features/Redux/planningSlice";
import { selectLoading } from "../../../features/Redux/tripSlice";

const dayShift = 1;

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
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectLoading);
  const planningId = useAppSelector(selectPlanningId);

  return (
    <div style={{ display: "flex" }}>
      <div className={styles.settingsIcon}>
        <Tooltip title="Visualiser le PDF">
          <IconButton
            onClick={() => navigate(ERouterPaths.pdf)}
            size="small"
            color="error"
          >
            <PictureAsPdfIcon />
          </IconButton>
        </Tooltip>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Tooltip title="Télécharger les pièces jointes">
            <IconButton
              onClick={() => dispatch(exportAttachments(planningId!))}
              size="small"
              color="secondary"
            >
              <DownloadIconRounded />
            </IconButton>
          </Tooltip>
        )}
      </div>
      <div className={styles.daysHeader}>
        <ButtonBase
          className={styles.arrowButtonL}
          sx={{
            position: "absolute",
            borderRadius: "0 50% 50% 0",
            backgroundColor: "#8f8f8f40",
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
            backgroundColor: "#8f8f8f40",
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
