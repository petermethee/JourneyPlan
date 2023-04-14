import {
  onDragOverCalendarStyle,
  onDragOverSideDataStyle,
} from "./DraggableCSS";

export const minColWidth = 100;
export const cellHeight = 50;
export const sideDataDraggableWidth = 160;
export const sideDataDraggableHeight = 80;

export const hourLabelWidth = 0;

let columnWidth: number;

export const initPlanningDimensions = (initColWidth: number) => {
  columnWidth = initColWidth;
};

export const getDraggableStyle = (
  x: number,
  y: number,
  deltaMousePosition: { x: number; y: number }
) => {
  const offset = hourLabelWidth + sideDataDraggableWidth;
  let style;

  if (x < offset) {
    const clampedX = x - deltaMousePosition.x;
    const clampedY = y - deltaMousePosition.y;
    style = onDragOverSideDataStyle(clampedX, clampedY, sideDataDraggableWidth);
  } else {
    const clampedX =
      Math.floor((x - offset) / columnWidth) * columnWidth + offset;
    const clampedY = Math.floor(y / cellHeight) * cellHeight;
    style = onDragOverCalendarStyle(clampedX, clampedY, columnWidth);
  }

  return style;
};

export const getFinalDestination = (x: number, y: number): [number, number] => {
  const offset = hourLabelWidth + sideDataDraggableWidth;
  const row = Math.round(y / cellHeight);

  if (x < offset) {
    return [-1, row];
  } else {
    const col = Math.round((x - offset) / columnWidth);
    return [col, row];
  }
};
