import React, { useEffect, useRef } from "react";
import DraggableCardView from "./DraggableCardView";
import styles from "./SideData.module.css";
import { setSideDataWidth } from "../../Helper/planningHelper";
import IActivity from "../../Models/IActivity";

export const sideDataWidth = 240;
export default function SideData({
  unusedActivities,
}: {
  unusedActivities: IActivity[];
}) {
  document.documentElement.style.setProperty(
    "--sideDataWidth",
    sideDataWidth + "px"
  );
  const sideDataRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSideDataWidth(sideDataRef.current!.clientWidth);
  }, []);
  return (
    <div ref={sideDataRef} className={styles.sideDataContainer}>
      {unusedActivities.map((activity, i) => (
        <DraggableCardView key={i} id={i} index={i} onDragEnd={() => {}}>
          <div>{activity.name}</div>
        </DraggableCardView>
      ))}
    </div>
  );
}
