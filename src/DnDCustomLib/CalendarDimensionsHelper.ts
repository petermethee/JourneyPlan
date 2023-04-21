import { SIDE_DATA_COL_ID } from "../Components/Planning/SideData";
import {
  onDragOverCalendarStyle,
  onDragOverSideDataStyle,
} from "./DraggableCSS";

export const minColWidth = 100;
export const cellHeight = 70;
export const sideDataWidth = 220;
export const sideDataDraggableWidth = 200;
export const sideDataDraggableHeight = 100;
export const hoursLabelWidth = 40;
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
document.documentElement.style.setProperty(
  "--totalHeight",
  cellHeight * 24 + "px"
);

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
      Math.floor((x - offset - dragContainerCoord.x) / columnWidth) *
      columnWidth;

    const clampedY =
      Math.floor((y + scrollYOffset - dragContainerCoord.y) / cellHeight) *
      cellHeight;

    style = onDragOverCalendarStyle(
      clampedX,
      clampedY,
      columnWidth - 1,
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
      Math.floor((x - offset) / columnWidth) * columnWidth -
      dragContainerCoord.x +
      offset;
    const clampedY =
      Math.floor((y + scrollAdjust) / cellHeight) * cellHeight -
      dragContainerCoord.y -
      scrollAdjust;

    style = onDragOverCalendarStyle(
      clampedX,
      clampedY,
      columnWidth - 1,
      cellHeight * duration
    );
  }
  return style;
};

export const getFinalDestination = (
  x: number,
  y: number,
  scrollYOffset: number
): [string, number] => {
  const timeIndex = Math.floor((y + scrollYOffset) / cellHeight);

  if (x < offset) {
    return [SIDE_DATA_COL_ID, timeIndex];
  } else {
    const colIndex = Math.floor((x - offset) / columnWidth);
    return [colId[colIndex], timeIndex];
  }
};
