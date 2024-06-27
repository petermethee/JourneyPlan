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
  onResize: (duration: number) => void;
  artifactType: EArtifact;
}) {
  const dispatch = useAppDispatch();
  const [mouseDown, setMouseDown] = useState<null | number>(null);
  const [duration, setDuration] = useState(artifact.duration);

  const mouseUpListener = useCallback(() => {
    if (mouseDown) {
      setMouseDown(null);

      if (artifactType === EArtifact.Activity) {
        dispatch(
          updateActivity({
            ...(artifact as IActivity),
            duration,
          }),
        );
      } else {
        dispatch(
          updateTransport({
            ...(artifact as ITransport),
            duration,
          }),
        );
      }
    }
  }, [mouseDown, duration]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (mouseDown) {
        let delta = Math.round((event.clientY - mouseDown) / timeStep) / 4;
        const newDuration = Math.max(
          (artifact as IActivity | ITransport).duration + delta,
          0.25,
        );
        setDuration((prevState) => {
          if (prevState !== newDuration) {
            console.log("tag", newDuration);
            onResize(newDuration);
            return newDuration;
          }
          return prevState;
        });
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
      <DragHandleRoundedIcon
        fontSize="small"
        sx={{
          borderRadius: "50%",
          backgroundColor: "#39393933",
        }}
      />
    </div>
  );
}
