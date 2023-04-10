import React from "react";
import DraggableCardView from "./DraggableCardView";
import styles from "./SideData.module.css";

export default function SideData({
  unusedActivities,
}: {
  unusedActivities: string[];
}) {
  return (
    <div className={styles.sideDataContainer}>
      {unusedActivities.map((m, i) => (
        <DraggableCardView key={i} id={i} index={i} onDragEnd={() => {}}>
          <div>{m}</div>
        </DraggableCardView>
      ))}
    </div>
  );
}
