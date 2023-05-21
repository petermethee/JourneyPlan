import React from "react";
import styles from "./AccomodationDropZone.module.css";

export default function AccomodationDropZone({
  children,
  dropZoneRef,
}: {
  children: JSX.Element;
  dropZoneRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div ref={dropZoneRef} className={styles.container}>
      {children}
    </div>
  );
}
