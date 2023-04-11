import { CSSProperties } from "react";

export const onDragStyle = (x: number, y: number): CSSProperties => {
  return {
    top: y,
    left: x,
    transition: "0ms",
  };
};

export const onDropStyle: CSSProperties = {
  top: 0,
  left: 0,
  transition: "300ms",
};
