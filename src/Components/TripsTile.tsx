import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import styles from "./TripsTile.module.css";
import { ButtonBase } from "@mui/material";
import trip_bg from "../image/trip_bg.jpg";
import { primaryColor } from "../style/cssGlobalStyle";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { routerPathes } from "../Helper/routerPathes";
import {
  Draggable,
  DraggableStateSnapshot,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { CSSProperties } from "react";
require("dayjs/locale/fr");
type TTileProps = {
  title: string;
  id: number;
  startDate: string;
  endDate: string;
  imagePath: string | null;
  index: number;
  onClick: (id: number) => void;
};
export default function TripsTile({
  title,
  id,
  startDate,
  endDate,
  imagePath,
  index,
  onClick,
}: TTileProps) {
  let background: string;
  try {
    background = require(`../image/${imagePath}`);
  } catch (error) {
    background = trip_bg;
  }
  const navigate = useNavigate();

  const getStyle = (
    style: DraggingStyle | NotDraggingStyle | undefined,
    snapshot: DraggableStateSnapshot
  ): CSSProperties => {
    if (!snapshot.isDropAnimating) {
      return style as CSSProperties;
    }

    // patching the existing style
    return {
      ...style,
      opacity: 0,
    };
  };

  return (
    <Draggable draggableId={id.toString()} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            {...provided.draggableProps}
            ref={provided.innerRef}
            className={`${styles.cardContainer} ${
              snapshot.draggingOver === "deleteZone" && styles.deleteItem
            }`}
            onClick={() => onClick(id)}
            style={getStyle(provided.draggableProps.style, snapshot)}
          >
            <ButtonBase
              className={styles.rippleEffect}
              sx={{ position: "absolute", color: "white", zIndex: 1 }}
            />
            <img
              src={background}
              alt={`url(${trip_bg})`}
              className={styles.cardBg}
            />

            <div className={styles.content}>
              <div className={styles.title}>{title}</div>
              <div className={styles.editIcon}>
                <IconButton
                  sx={{ backgroundColor: "#ffffff82" }}
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    navigate(`${routerPathes.addTrip}/${id}`);
                  }}
                >
                  <EditRoundedIcon
                    sx={{ color: primaryColor }}
                    fontSize="small"
                  />
                </IconButton>
              </div>
              <div
                className={styles.dragIndicator}
                {...provided.dragHandleProps}
              >
                <DragIndicatorIcon />
              </div>
              <div>
                {dayjs(startDate)
                  .locale("fr")
                  .format("DD MMM YYYY")
                  .toUpperCase()}{" "}
                -{" "}
                {dayjs(endDate)
                  .locale("fr")
                  .format("DD MMM YYYY")
                  .toUpperCase()}
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
}
