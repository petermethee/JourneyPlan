import { SIDE_DATA_COL_ID } from "../Components/Planning/SideData/SideData";
import {
  onDragOverCalendarStyle,
  onDragOverSideDataStyle,
} from "./DraggableCSS";

export const minColWidth = 200;
export const cellHeight = 70;

const hoursLabelWidth = 50;
const accomodationDropZoneHeight = 100;

document.documentElement.style.setProperty(
  "--totalHeight",
  cellHeight * 24 + "px"
);

document.documentElement.style.setProperty(
  "--hoursLabelWidth",
  hoursLabelWidth + "px"
);
document.documentElement.style.setProperty("--cellHeight", cellHeight + "px");
document.documentElement.style.setProperty(
  "--accomodationDropZoneHeight",
  accomodationDropZoneHeight + "px"
);

let columnWidth: number;
let colIds: string[];
let calendarRect: DOMRect;
export let sideDataTop: number;

export const initPlanningDimensions = (
  initColWidth: number,
  initColIds: string[],
  initCalendarRect: DOMRect
) => {
  columnWidth = initColWidth;
  colIds = initColIds;
  calendarRect = initCalendarRect;
};

export const setCalendarBoundary = (initCalendarRect: DOMRect) => {
  calendarRect = initCalendarRect;
};

export const setSideDataTop = (top: number) => {
  sideDataTop = top;
};

export const getDraggableCalendarStyle = (
  x: number,
  y: number,
  deltaMousePosition: { x: number; y: number },
  dragContainerCoord: { x: number; y: number },
  duration: number
) => {
  let style;

  if (!isInsidePlanning(x, y)) {
    const newX = x - deltaMousePosition.x;
    const newY = y - deltaMousePosition.y;

    style = onDragOverSideDataStyle(newX, newY);
  } else {
    const clampedX =
      Math.floor((x - calendarRect.left - dragContainerCoord.x) / columnWidth) *
      columnWidth;

    const clampedY =
      Math.floor((y - dragContainerCoord.y - calendarRect.top) / cellHeight) *
      cellHeight;
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
  duration: number
) => {
  let style;

  if (!isInsidePlanning(x, y)) {
    const newX = x - deltaMousePosition.x;
    const newY = y - deltaMousePosition.y;
    style = onDragOverSideDataStyle(newX, newY);
  } else {
    const clampedX =
      Math.floor((x - calendarRect.left) / columnWidth) * columnWidth -
      dragContainerCoord.x +
      calendarRect.left;

    const clampedY =
      Math.floor((y - calendarRect.top) / cellHeight) * cellHeight -
      dragContainerCoord.y +
      calendarRect.top;

    style = onDragOverCalendarStyle(
      clampedX,
      clampedY + 2,
      columnWidth,
      cellHeight * duration
    );
  }
  return style;
};

export const getFinalDestination = (x: number, y: number): [string, number] => {
  const timeIndex = Math.floor((y - calendarRect.y) / cellHeight);

  if (x < calendarRect.x) {
    return [SIDE_DATA_COL_ID, timeIndex];
  } else {
    const colIndex = Math.floor((x - calendarRect.x) / columnWidth);
    return [colIds[colIndex], timeIndex];
  }
};

export const getColumnWidth = () => columnWidth;

const isInsidePlanning = (x: number, y: number) => {
  if (
    x > calendarRect.left &&
    x < calendarRect.left + calendarRect.width &&
    y > calendarRect.top &&
    y < calendarRect.top + calendarRect.height
  ) {
    return true;
  }
  return false;
};
