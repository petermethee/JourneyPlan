import styles from "./SideData.module.css";

import draggableStyles from "../../Planning/DraggableCardView.module.css";
import { useRef, useState } from "react";
import {
  sideDataDraggableWidth,
  getDraggableSideDataStyle,
} from "../../../DnDCustomLib/CalendarDimensionsHelper";
import { sideDataDragContainerStyle } from "../../../DnDCustomLib/DraggableCSS";
import { useAppSelector } from "../../../app/hooks";
import { selectActivities } from "../../../features/Redux/activitySlice";
import DraggableCardView from "../DraggableCardView";
export const SIDE_DATA_COL_ID = "sideDataDropId";
export default function SideData() {
  const sideDataRef = useRef<HTMLDivElement>(null);
  const activities = useAppSelector(selectActivities);
  const [marginTop, setMarginTop] = useState(0);

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    setMarginTop((prevState) => {
      const marginMax = Math.max(
        0,
        sideDataRef.current!.clientHeight -
          sideDataRef.current!.parentElement!.parentElement!.clientHeight
      );
      const tempValue = prevState - 150 * Math.sign(event.deltaY);
      const newMarginTop = Math.max(-marginMax, Math.min(0, tempValue));

      return newMarginTop;
    });
  };

  const onChange = () => {};
  return (
    <div className={styles.sideDataContainer} onWheel={onWheel}>
      <SideDataHeader onChange={onChange} />
      <div className={styles.scrollContainer} style={{ marginTop: marginTop }}>
        <div ref={sideDataRef} className={styles.subContainer}>
          {activities
            .filter((activity) => !activity.used)
            .map((activity) => (
              <DraggableCardView
                key={activity.id}
                id={activity.id}
                containerStyle={sideDataDragContainerStyle(
                  sideDataDraggableWidth
                )}
                duration={activity.duration}
                shwoCaseClass={styles.showcaseSideData}
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
