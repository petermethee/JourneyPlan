import DraggableCardView from "./DraggableCardView";
import styles from "./SideData.module.css";
import IActivity from "../../Models/IActivity";
import { sideDataDraggableWidth } from "../../DnDCustomLib/CalendarDimensionsHelper";
import { sideDraggableStyle } from "../../DnDCustomLib/DraggableCSS";

export default function SideData({
  unusedActivities,
}: {
  unusedActivities: IActivity[];
}) {
  return (
    <div
      className={styles.sideDataContainer}
      style={{ width: sideDataDraggableWidth }}
    >
      {unusedActivities.map((activity, i) => (
        <DraggableCardView
          key={i}
          id={activity.id}
          index={i}
          initialStyle={sideDraggableStyle(sideDataDraggableWidth)}
        >
          <div>{activity.name}</div>
        </DraggableCardView>
      ))}
    </div>
  );
}
