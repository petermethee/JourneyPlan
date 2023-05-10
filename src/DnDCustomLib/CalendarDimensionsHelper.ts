import { RELATIVE_CALENDAR } from "../Components/Planning/Calendar/CalendarView";
import { SIDE_DATA_COL_ID } from "../Components/Planning/SideData/SideData";
import {
  onDragOverCalendarStyle,
  onDragOverSideDataStyle,
} from "./DraggableCSS";

export const minColWidth = 200;
export const cellHeight = 70;
export let sideDataTop: number;

const ratioTimeStepCellHeight = 4;
const timeStep = cellHeight / ratioTimeStepCellHeight;

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
let lastTimeIndex: number;

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
  const relativeX = x - calendarRect.left; //Relative to calendar position
  const clampedX = Math.max(0, Math.min(calendarRect.width - 1, relativeX));

  const steppedX =
    Math.floor((clampedX - dragContainerCoord.x) / columnWidth) * columnWidth; //Relative to draggable container position

  const relativeY = y - calendarRect.top; //Relative to calendar position
  const clampedY = Math.max(
    deltaMousePosition.y + 2,
    Math.min(calendarRect.height - deltaMousePosition.y, relativeY)
  );

  lastTimeIndex =
    Math.floor((clampedY - deltaMousePosition.y) / timeStep) /
    ratioTimeStepCellHeight;
  console.log("timeIndex", lastTimeIndex);

  const relativeTimeStepIndex = Math.floor(
    (clampedY - dragContainerCoord.y - deltaMousePosition.y) / timeStep
  ); //Relative to draggable container position
  const steppedY = relativeTimeStepIndex * timeStep;

  const style = onDragOverCalendarStyle(
    steppedX,
    steppedY,
    columnWidth,
    cellHeight * duration
  );

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
    const newX = x - deltaMousePosition.x - dragContainerCoord.x;
    const newY = y - deltaMousePosition.y - dragContainerCoord.y;
    style = onDragOverSideDataStyle(newX, newY);
  } else {
    const clampedX =
      Math.floor((x - calendarRect.left) / columnWidth) * columnWidth -
      dragContainerCoord.x +
      calendarRect.left;

    const clampedY =
      Math.floor(
        (y -
          calendarRect.top -
          ((duration * ratioTimeStepCellHeight - 1) / 2) * timeStep) /
          timeStep
      ) *
        timeStep -
      dragContainerCoord.y +
      calendarRect.top;

    lastTimeIndex =
      Math.floor(
        (y -
          calendarRect.top -
          ((duration * ratioTimeStepCellHeight - 1) / 2) * timeStep) /
          timeStep
      ) / ratioTimeStepCellHeight;

    console.log("lastimestep", lastTimeIndex);

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
  if (x < calendarRect.x) {
    return [SIDE_DATA_COL_ID, lastTimeIndex];
  } else {
    const colIndex = Math.floor((x - calendarRect.x) / columnWidth);
    return [colIds[colIndex], lastTimeIndex];
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
