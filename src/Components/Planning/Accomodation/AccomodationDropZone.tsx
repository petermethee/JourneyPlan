import React, { useEffect, useRef } from "react";
import styles from "./AccomodationDropZone.module.css";
import { setDropZoneBoundary } from "../../../DnDCustomLib/CalendarDimensionsHelper";
export default function AccomodationDropZone() {
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDropZoneBoundary(dropZoneRef.current!.getBoundingClientRect());
  }, []);
  return (
    <div ref={dropZoneRef} className={styles.container}>
      {" "}
    </div>
  );
}
