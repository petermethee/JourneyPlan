import React, { useMemo } from "react";
import styles from "./AccomodationDropZone.module.css";
import { useAppSelector } from "../../../app/hooks";
import { selectAccomodationIsDragged } from "../../../features/Redux/accomodationsSlice";

export default function AccomodationDropZone({
  children,
  dropZoneRef,
}: {
  children: JSX.Element;
  dropZoneRef: React.RefObject<HTMLDivElement>;
}) {
  const accomodatonIsDragged = useAppSelector(selectAccomodationIsDragged);

  const animation = useMemo(() => {
    if (accomodatonIsDragged) {
      return `${styles.expand} 300ms ease forwards`;
    }
    return `${styles.retract} 300ms ease 300ms both`;
  }, [accomodatonIsDragged]);
  return (
    <div
      ref={dropZoneRef}
      className={`${styles.container}`}
      style={{
        animation,
      }}
    >
      {children}
    </div>
  );
}
