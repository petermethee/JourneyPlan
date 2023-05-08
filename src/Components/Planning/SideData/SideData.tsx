import styles from "./SideData.module.css";
import draggableStyle from "../DraggableCardView.module.css";

import draggableStyles from "../../Planning/DraggableCardView.module.css";
import { useRef, useState } from "react";
import {
  getDraggableSideDataStyle,
  sideDataTop,
} from "../../../DnDCustomLib/CalendarDimensionsHelper";
import { sideDataDragContainerStyle } from "../../../DnDCustomLib/DraggableCSS";
import { useAppSelector } from "../../../app/hooks";
import { selectActivities } from "../../../features/Redux/activitiesSlice";
import DraggableCardView from "../DraggableCardView";
import SideDataHeader from "./SideDataHeader";
import { selectTransports } from "../../../features/Redux/transportsSlice";
import { selectAccomodations } from "../../../features/Redux/accomodationsSlice";

import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ActivityDataCard from "../ArtifactsDataCard/ActivityDataCard";
import { EArtifact } from "../../../Models/EArtifacts";

export const SIDE_DATA_COL_ID = "sideDataDropId";

export default function SideData() {
  const sideDataRef = useRef<HTMLDivElement>(null);
  const activities = useAppSelector(selectActivities);
  const transports = useAppSelector(selectTransports);
  const accomodations = useAppSelector(selectAccomodations);

  const [marginTop, setMarginTop] = useState(0);
  const [currentArtifact, setCurrentArtifact] = useState(EArtifact.Activity);

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    setMarginTop((prevState) => {
      const marginMax = Math.max(
        0,
        sideDataRef.current!.clientHeight -
          sideDataRef.current!.parentElement!.parentElement!.clientHeight +
          sideDataTop
      );
      const tempValue = prevState - 150 * Math.sign(event.deltaY); //150 is the arbitrary choosen step
      const newMarginTop = Math.max(-marginMax, Math.min(0, tempValue));

      return newMarginTop;
    });
  };

  return (
    <div className={styles.sideDataContainer} onWheel={onWheel}>
      <SideDataHeader onChange={(menu) => setCurrentArtifact(menu)} />
      <div className={styles.scrollContainer} style={{ marginTop: marginTop }}>
        <div ref={sideDataRef} className={styles.subContainer}>
          {currentArtifact === EArtifact.Activity
            ? activities
                .filter((activity) => !activity.used)
                .map((activity) => (
                  <DraggableCardView
                    key={activity.id}
                    id={activity.id}
                    containerStyle={sideDataDragContainerStyle()}
                    duration={activity.duration}
                    shwoCaseClass={draggableStyle.showcaseSideData}
                    source={{ colId: SIDE_DATA_COL_ID, timeIndex: -1 }}
                    getDraggableStyle={getDraggableSideDataStyle}
                    disappearAnim={draggableStyles.sideDataDisappearAnim}
                    artifactType={EArtifact.Activity}
                  >
                    <ActivityDataCard activity={activity} />
                  </DraggableCardView>
                ))
            : transports
                .filter((transport) => !transport.used)
                .map((transport) => (
                  <DraggableCardView
                    key={transport.id}
                    id={transport.id}
                    containerStyle={sideDataDragContainerStyle()}
                    duration={transport.duration}
                    shwoCaseClass={draggableStyle.showcaseSideData}
                    source={{ colId: SIDE_DATA_COL_ID, timeIndex: -1 }}
                    getDraggableStyle={getDraggableSideDataStyle}
                    disappearAnim={draggableStyles.sideDataDisappearAnim}
                    artifactType={EArtifact.Transport}
                  >
                    <div>{transport.name}</div>
                  </DraggableCardView>
                ))}
        </div>
      </div>
      <Fab
        color="primary"
        size="medium"
        sx={{ position: "absolute", bottom: "10px", right: "10px" }}
      >
        <AddIcon />
      </Fab>
    </div>
  );
}
