import DraggableCardView from "./DraggableCardView";
import styles from "./SideData.module.css";
import { sideDataDragContainerStyle } from "../../DnDCustomLib/DraggableCSS";
import {
  getDraggableSideDataStyle,
  sideDataDraggableWidth,
} from "../../DnDCustomLib/CalendarDimensionsHelper";
import { useAppSelector } from "../../app/hooks";
import { selectActivities } from "../../features/Redux/activitySlice";

export const SIDE_DATA_COL_ID = "sideDataDropId";
export default function SideData({ scrollYOffset }: { scrollYOffset: number }) {
  const activities = useAppSelector(selectActivities);
  return (
    <div className={styles.sideDataContainer}>
      {activities
        .filter((activity) => !activity.used)
        .map((activity) => (
          <DraggableCardView
            key={activity.id}
            id={activity.id}
            containerStyle={sideDataDragContainerStyle(sideDataDraggableWidth)}
            duration={activity.duration}
            shwoCaseClass={styles.showcaseSideData}
            source={{ colId: SIDE_DATA_COL_ID, timeIndex: -1 }}
            scrollYOffset={scrollYOffset}
            getDraggableStyle={getDraggableSideDataStyle}
          >
            <div>{activity.name}</div>
          </DraggableCardView>
        ))}
    </div>
  );
}
