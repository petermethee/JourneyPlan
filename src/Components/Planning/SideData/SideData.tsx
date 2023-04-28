import styles from "./SideData.module.css";
import draggableStyle from "../DraggableCardView.module.css";

import draggableStyles from "../../Planning/DraggableCardView.module.css";
import { useRef, useState } from "react";
import {
  sideDataDraggableWidth,
  getDraggableSideDataStyle,
} from "../../../DnDCustomLib/CalendarDimensionsHelper";
import { sideDataDragContainerStyle } from "../../../DnDCustomLib/DraggableCSS";
import { useAppSelector } from "../../../app/hooks";
import { selectActivities } from "../../../features/Redux/activitiesSlice";
import DraggableCardView from "../DraggableCardView";
import SideDataHeader, { EArtifacts } from "./SideDataHeader";
import { selectTransports } from "../../../features/Redux/transportsSlice";
import { selectAccomodations } from "../../../features/Redux/accomodationsSlice";
export const SIDE_DATA_COL_ID = "sideDataDropId";

export default function SideData() {
  const sideDataRef = useRef<HTMLDivElement>(null);
  const activities = useAppSelector(selectActivities);
  const transports = useAppSelector(selectTransports);
  const accomodations = useAppSelector(selectAccomodations);

  const [marginTop, setMarginTop] = useState(0);
  const [currentArtifact, setCurrentArtifact] = useState(EArtifacts.Activities);

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    setMarginTop((prevState) => {
      const marginMax = Math.max(
        0,
        sideDataRef.current!.clientHeight -
          sideDataRef.current!.parentElement!.parentElement!.clientHeight +
          48 //48 is the height of tab layout
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
          {currentArtifact === EArtifacts.Activities
            ? activities
                .filter((activity) => !activity.used)
                .map((activity) => (
                  <DraggableCardView
                    key={activity.id}
                    id={activity.id}
                    containerStyle={sideDataDragContainerStyle(
                      sideDataDraggableWidth
                    )}
                    duration={activity.duration}
                    shwoCaseClass={draggableStyle.showcaseSideData}
                    source={{ colId: SIDE_DATA_COL_ID, timeIndex: -1 }}
                    getDraggableStyle={getDraggableSideDataStyle}
                    disappearAnim={draggableStyles.sideDataDisappearAnim}
                  >
                    <div>{activity.name}</div>
                  </DraggableCardView>
                ))
            : transports
                .filter((activity) => !activity.used)
                .map((activity) => (
                  <DraggableCardView
                    key={activity.id}
                    id={activity.id}
                    containerStyle={sideDataDragContainerStyle(
                      sideDataDraggableWidth
                    )}
                    duration={activity.duration}
                    shwoCaseClass={draggableStyle.showcaseSideData}
                    source={{ colId: SIDE_DATA_COL_ID, timeIndex: -1 }}
                    getDraggableStyle={getDraggableSideDataStyle}
                    disappearAnim={draggableStyles.sideDataDisappearAnim}
                  >
                    <div>{activity.name}</div>
                  </DraggableCardView>
                ))}
        </div>
      </div>
    </div>
  );
}
