import { SIDE_DATA_COL_ID } from "../Components/Planning/SideData";
import {
  onDragOverCalendarStyle,
  onDragOverSideDataStyle,
} from "./DraggableCSS";

export const minColWidth = 100;
export const cellHeight = 100;
export const sideDataWidth = 220;
export const sideDataDraggableWidth = 200;
export const sideDataDraggableHeight = 100;
export const hoursLabelWidth = 30;
const offset = hoursLabelWidth + sideDataDraggableWidth + 20;

document.documentElement.style.setProperty(
  "--sideDataWidth",
  sideDataWidth + "px"
);
document.documentElement.style.setProperty(
  "--hoursLabelWidth",
  hoursLabelWidth + "px"
);

document.documentElement.style.setProperty("--cellHeight", cellHeight + "px");

let columnWidth: number;
let colId: string[];

export const initPlanningDimensions = (
  initColWidth: number,
  initColId: string[]
) => {
  columnWidth = initColWidth;
  colId = initColId;
};

export const getDraggableCalendarStyle = (
  x: number,
  y: number,
  deltaMousePosition: { x: number; y: number },
  dragContainerCoord: { x: number; y: number },
  duration: number,
  scrollYOffset: number
) => {
  let style;

  if (x < offset) {
    const newX = x - deltaMousePosition.x;
    const newY = y - deltaMousePosition.y + scrollYOffset;
    style = onDragOverSideDataStyle(newX, newY);
  } else {
    const clampedX =
      Math.floor((x - offset) / columnWidth) * columnWidth +
      -dragContainerCoord.x;
    const clampedY =
      Math.floor((y + scrollYOffset) / cellHeight) * cellHeight -
      dragContainerCoord.y;
    style = onDragOverCalendarStyle(
      clampedX,
      clampedY,
      columnWidth,
      cellHeight * duration
    );
  }

  return style;
};

export const getDraggableSideDataStyle = (
  x: number,
  y: number,
  deltaMousePosition: { x: number; y: number },
  dragContainerCoord: { x: number; y: number },
  duration: number,
  scrollYOffset: number
) => {
  let style;

  const scrollAdjust = scrollYOffset % cellHeight;

  if (x < offset) {
    const newX = x - deltaMousePosition.x;
    const newY = y - deltaMousePosition.y;
    style = onDragOverSideDataStyle(newX, newY);
  } else {
    const clampedX =
      Math.floor((x - offset) / columnWidth) * columnWidth +
      -dragContainerCoord.x +
      offset;
    const clampedY =
      Math.floor((y + scrollAdjust) / cellHeight) * cellHeight -
      dragContainerCoord.y -
      scrollAdjust;
    style = onDragOverCalendarStyle(
      clampedX,
      clampedY,
      columnWidth,
      cellHeight * duration
    );
  }
  return style;
};

export const getFinalDestination = (x: number, y: number): [string, number] => {
  const timeIndex = Math.floor(y / cellHeight);

  if (x < offset) {
    return [SIDE_DATA_COL_ID, timeIndex];
  } else {
    const colIndex = Math.floor((x - offset) / columnWidth);
    return [colId[colIndex], timeIndex];
  }
};
