import IconButton from "@mui/material/IconButton";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import styles from "./TripsTile.module.css";
import { ButtonBase } from "@mui/material";
import { primaryColor } from "../../style/cssGlobalStyle";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { ERouterPathes } from "../../Helper/ERouterPathes";
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
export default function TripTile({
  title,
  id,
  startDate,
  endDate,
  imagePath,
  index,
  onClick,
}: TTileProps) {
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
              src={
                process.env.REACT_APP_TRIP_PICTURE +
                "/" +
                (imagePath ?? "trip_bg.jpg")
              }
              alt={`Trip`}
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
                    navigate(`${ERouterPathes.addTrip}/${id}`);
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
