import { Slider } from "@mui/material";
import { useMemo } from "react";
export default function TimeInput({
  duration,
  setDuration,
}: {
  duration: number;
  setDuration: (duration: number) => void;
}) {
  const hours = useMemo(() => duration.toString().split(".")[0], [duration]);
  const minutes = useMemo(() => {
    const min = (duration - parseInt(duration.toString().split(".")[0])) * 60;
    return min === 0 ? "00" : min;
  }, [duration]);

  return (
    <div
      style={{
        width: "100%",
      }}
    >
      <div>
        <span>Durée: </span> {hours}h{minutes}
      </div>
      <Slider
        min={0.25}
        max={8}
        step={0.25}
        marks
        size="small"
        value={duration}
        onChange={(_e, value) => setDuration(value as number)}
      />
    </div>
  );
}
