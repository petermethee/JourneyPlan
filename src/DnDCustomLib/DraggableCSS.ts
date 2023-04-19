import { CSSProperties } from "react";

export const onDragOverSideDataStyle = (
  x: number,
  y: number
): CSSProperties => {
  return {
    top: y,
    left: x,
    transition: "all 300ms, top 0s, left 0s",
  };
};

export const onDragOverCalendarStyle = (
  x: number,
  y: number,
  width: number,
  height: number
): CSSProperties => {
  return {
    top: y,
    left: x,
    width,
    height,
    boxShadow: "0px 0px 8px 0px #000000bb",
    borderRadius: "5px",
    transform: "scale(0.95)",
  };
};

export const sideDataDragContainerStyle = (width: number): CSSProperties => {
  return {
    position: "relative",
    width,
    height: "100px",
  };
};
export const calendarDragContainerStyle = (
  width: number,
  height: number,
  top: number
): CSSProperties => {
  return {
    position: "absolute",
    width,
    height,
    top,
  };
};
