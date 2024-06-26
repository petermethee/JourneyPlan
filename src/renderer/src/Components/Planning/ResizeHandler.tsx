import { useAppDispatch } from "@renderer/app/hooks";
import styles from "./ResizeHandler.module.css";
import { useCallback, useEffect, useState } from "react";
import { EArtifact } from "@renderer/Models/EArtifacts";
import { updateActivity } from "@renderer/features/Redux/activitiesSlice";
import IActivity from "@renderer/Models/IActivity";
import { updateTransport } from "@renderer/features/Redux/transportsSlice";
import ITransport from "@renderer/Models/ITransport";
import DragHandleRoundedIcon from "@mui/icons-material/DragHandleRounded";
import { timeStep } from "@renderer/DnDCustomLib/CalendarDimensionsHelper";

export default function ResizeHandler({
  artifact,
  onResize,
  artifactType,
}: {
  artifact: IActivity | ITransport;
  onResize: (resize: number) => void;
  artifactType: EArtifact;
}) {
  const dispatch = useAppDispatch();
  const [mouseDown, setMouseDown] = useState<null | number>(null);
  const [delta, setDelta] = useState(0);
  const mouseUpListener = useCallback(() => {
    setMouseDown(null);
    if (mouseDown) {
      if (artifactType === EArtifact.Activity) {
        dispatch(
          updateActivity({
            ...(artifact as IActivity),
            duration: artifact.duration + delta,
          }),
        );
      } else {
        dispatch(
          updateTransport({
            ...(artifact as ITransport),
            duration: artifact.duration + delta,
          }),
        );
      }
    }
  }, [mouseDown, delta]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (mouseDown) {
        const newDelta = Math.round((event.clientY - mouseDown) / timeStep) / 4;
        if (newDelta !== 0) {
          setDelta(newDelta);
          onResize(newDelta);
        }
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseDown]);

  useEffect(() => {
    window.addEventListener("mouseup", mouseUpListener);
    return () => {
      window.removeEventListener("mouseup", mouseUpListener);
    };
  }, [mouseUpListener]);

  return (
    <div
      className={styles.resizeHandler}
      onMouseDown={(e) => setMouseDown(e.clientY)}
    >
      <DragHandleRoundedIcon />
    </div>
  );
}
