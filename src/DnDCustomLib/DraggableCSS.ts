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
    boxShadow: "none",
    borderRadius: 0,
  };
};

export const sideDataDragContainerStyle = (width: number) => {
  return { width, height: "100px" };
};
export const calendarDragContainerStyle = (
  width: number,
  height: number,
  top: number
): CSSProperties => {
  return {
    width,
    height,
    top,
  };
};
