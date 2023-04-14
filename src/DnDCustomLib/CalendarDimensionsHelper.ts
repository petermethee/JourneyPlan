import {
  onDragOverCalendarStyle,
  onDragOverSideDataStyle,
} from "./DraggableCSS";

export const minColWidth = 100;
export const cellHeight = 50;
export const sideDataDraggableWidth = 200;
export const sideDataDraggableHeight = 100;
export const hourLabelWidth = 0;
const offset = hourLabelWidth + sideDataDraggableWidth + 20;

document.documentElement.style.setProperty(
  "--sideDataDraggableWidth",
  sideDataDraggableWidth + "px"
);
let columnWidth: number;

export const initPlanningDimensions = (initColWidth: number) => {
  columnWidth = initColWidth;
};

export const getDraggableStyle = (
  x: number,
  y: number,
  deltaMousePosition: { x: number; y: number },
  parentCoord: { x: number; y: number },
  duration: number
) => {
  let style;

  if (x < offset) {
    const newX = x - deltaMousePosition.x;
    const newY = y - deltaMousePosition.y;
    style = onDragOverSideDataStyle(newX, newY);
  } else {
    const clampedX =
      Math.floor((x - offset) / columnWidth) * columnWidth +
      offset -
      parentCoord.x;
    const clampedY = Math.floor(y / cellHeight) * cellHeight - parentCoord.y;
    style = onDragOverCalendarStyle(
      clampedX,
      clampedY,
      columnWidth,
      cellHeight * duration
    );
  }

  return style;
};

export const getFinalDestination = (x: number, y: number): [number, number] => {
  const row = Math.floor(y / cellHeight);

  if (x < offset) {
    return [-1, row];
  } else {
    const col = Math.floor((x - offset) / columnWidth);
    return [col, row];
  }
};
