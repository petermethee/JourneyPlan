import { CSSProperties } from "react";

export const onDragOverSideDataStyle = (
  x: number,
  y: number,
  width: number
): CSSProperties => {
  return {
    position: "absolute",
    top: y,
    left: x,
    transition: "all 300ms, top 0s, left 0s",
    width,
  };
};

export const onDragOverCalendarStyle = (
  x: number,
  y: number,
  width: number
): CSSProperties => {
  return {
    position: "absolute",
    top: y,
    left: x,
    width,
    height: "80px",
  };
};

export const sideDraggableStyle = (width: number): CSSProperties => {
  return {
    position: "relative",
    top: 0,
    left: 0,
    width,
  };
};
export const calendarDraggableStyle = (
  columnWidthState: number
): CSSProperties => {
  return {
    position: "relative",
    width: columnWidthState,
    height: "80px",
  };
};
