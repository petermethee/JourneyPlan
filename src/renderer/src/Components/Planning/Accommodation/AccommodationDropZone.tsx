import React, { useMemo } from "react";
import styles from "./AccommodationDropZone.module.css";
import { useAppSelector } from "../../../app/hooks";
import { selectArtifactIsDragged } from "../../../features/Redux/planningSlice";
import { EArtifact } from "../../../Models/EArtifacts";
import AccommodationIcon from "../../Shared/AccommodationIcon";

const animations = {
  expand: styles.expand,
  hide: styles.hide,
  retract: `${styles.retract} 300ms ease 300ms both`,
  show: `${styles.show} 300ms ease 300ms both`,
};
export default function AccommodationDropZone({
  children,
  dropZoneRef,
}: {
  children: JSX.Element[];
  dropZoneRef: React.RefObject<HTMLDivElement>;
}) {
  const artifactDragged = useAppSelector(selectArtifactIsDragged);

  const currentStyle = useMemo(() => {
    if (artifactDragged === EArtifact.Accommodation) {
      return animations.expand;
    } else if (artifactDragged !== null) {
      return animations.hide;
    }
    return "";
  }, [artifactDragged]);

  return (
    <div
      ref={dropZoneRef}
      className={`${styles.container} ${currentStyle}`}
      style={{
        WebkitTransitionDelay: artifactDragged ? "0ms" : "300ms",
      }}
    >
      <div
        className={styles.textContainer}
        style={{
          opacity: artifactDragged === EArtifact.Accommodation ? 1 : 0,
        }}
      >
        <div className={styles.textInfo}>
          <AccommodationIcon />
          Hébergement
        </div>
      </div>

      {children}
    </div>
  );
}
