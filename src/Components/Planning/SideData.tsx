import DraggableCardView from "./DraggableCardView";
import styles from "./SideData.module.css";
import IActivity from "../../Models/IActivity";
import { sideDataDragContainerStyle } from "../../DnDCustomLib/DraggableCSS";
import { sideDataDraggableWidth } from "../../DnDCustomLib/CalendarDimensionsHelper";

export default function SideData({
  unusedActivities,
}: {
  unusedActivities: IActivity[];
}) {
  return (
    <div className={styles.sideDataContainer}>
      {unusedActivities.map((activity, i) => (
        <DraggableCardView
          key={activity.id}
          id={activity.id}
          containerStyle={sideDataDragContainerStyle(sideDataDraggableWidth)}
          duration={activity.duration}
          className={styles.card}
        >
          <div>{activity.name}</div>
        </DraggableCardView>
      ))}
    </div>
  );
}
