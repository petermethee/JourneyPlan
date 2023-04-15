import DraggableCardView from "./DraggableCardView";
import styles from "./SideData.module.css";
import IActivity from "../../Models/IActivity";
import { sideDataDragContainerStyle } from "../../DnDCustomLib/DraggableCSS";
import { sideDataDraggableWidth } from "../../DnDCustomLib/CalendarDimensionsHelper";
import { useAppSelector } from "../../app/hooks";
import { selectActivities } from "../../features/Redux/activitySlice";

export const SIDE_DATA_COL_ID = "sideDataDropId";
export default function SideData() {
  const activities = useAppSelector(selectActivities);
  return (
    <div className={styles.sideDataContainer}>
      {activities.map((activity) => (
        <DraggableCardView
          key={activity.id}
          id={activity.id}
          containerStyle={sideDataDragContainerStyle(
            sideDataDraggableWidth,
            activity.used
          )}
          duration={activity.duration}
          className={styles.card}
          source={{ colId: SIDE_DATA_COL_ID, timeIndex: -1 }}
        >
          <div>{activity.name}</div>
        </DraggableCardView>
      ))}
    </div>
  );
}
