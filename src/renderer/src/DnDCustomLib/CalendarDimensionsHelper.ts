import { CSSProperties } from "react";
import { SIDE_DATA_COL_ID } from "../Components/Planning/SideData/SideData";
import {
  onDragOverAccommodationDZStyle,
  onDragOverCalendarStyle,
  onDragOverSideDataStyle,
} from "./DraggableCSS";

export const minColWidth = 170;
export const cellHeight = 70;
export const accommodationDropZoneHeight = 100;
export const expandedAccommodationDropZoneHeight = 200;

export let sideDataTop: number;

const ratioTimeStepCellHeight = 4;
export const timeStep = cellHeight / ratioTimeStepCellHeight;

const hoursLabelWidth = 50;

document.documentElement.style.setProperty(
  "--totalHeight",
  cellHeight * 24 + "px",
);

document.documentElement.style.setProperty(
  "--hoursLabelWidth",
  hoursLabelWidth + "px",
);
document.documentElement.style.setProperty("--cellHeight", cellHeight + "px");
document.documentElement.style.setProperty(
  "--accommodationDropZoneHeight",
  accommodationDropZoneHeight + "px",
);
document.documentElement.style.setProperty(
  "--expandedAccommodationDropZoneHeight",
  expandedAccommodationDropZoneHeight + "px",
);
let columnWidth: number;
let colIds: string[];
let calendarRect: DOMRect;
let lastTimeIndex: number;

let dropZoneRect: DOMRect;

let colIndexOffset = 0;

// UI dimensions and parameters
export const setDropZoneBoundary = (initDropZoneRect: DOMRect) => {
  dropZoneRect = initDropZoneRect;
};

export const setColIds = (initColIds: string[]) => {
  colIds = initColIds;
};
export const setColOffsetIndex = (offset: number) => (colIndexOffset = offset);
export const initPlanningDimensions = (
  initColWidth: number,
  initCalendarRect: DOMRect,
) => {
  columnWidth = initColWidth;
  calendarRect = initCalendarRect;
};

export const setCalendarBoundary = (initCalendarRect: DOMRect) => {
  calendarRect = initCalendarRect;
};

export const setSideDataTop = (top: number) => {
  sideDataTop = top;
};

// draggable style

export const getDraggableCalendarStyle = (
  x: number,
  y: number,
  deltaMousePosition: { x: number; y: number },
  dragContainerCoord: { x: number; y: number },
  duration: number,
) => {
  const relativeX = x - calendarRect.left; //Relative to calendar position
  const clampedX = Math.max(1, Math.min(calendarRect.width - 1, relativeX));

  const steppedX =
    Math.floor((clampedX - dragContainerCoord.x) / columnWidth) * columnWidth; //Relative to draggable container position

  const relativeY = y - calendarRect.top; //Relative to calendar position
  const clampedY = Math.max(
    deltaMousePosition.y + 2,
    Math.min(
      calendarRect.height + deltaMousePosition.y - duration * cellHeight + 1,
      relativeY,
    ),
  );

  lastTimeIndex =
    Math.floor((clampedY - deltaMousePosition.y) / timeStep) /
    ratioTimeStepCellHeight;

  const relativeTimeStepIndex = Math.floor(
    (clampedY - dragContainerCoord.y - deltaMousePosition.y + 2) / timeStep,
  ); //Relative to draggable container position

  const steppedY = relativeTimeStepIndex * timeStep;

  const style = onDragOverCalendarStyle(
    steppedX,
    steppedY,
    columnWidth,
    cellHeight * duration,
  );

  return style;
};

export const getDraggableSideDataStyle = (
  x: number,
  y: number,
  deltaMousePosition: { x: number; y: number },
  dragContainerCoord: { x: number; y: number },
  duration: number,
) => {
  let style: CSSProperties;

  if (!isInsidePlanning(x, y)) {
    const newX = x - deltaMousePosition.x - dragContainerCoord.x;
    const newY = y - deltaMousePosition.y - dragContainerCoord.y;
    style = onDragOverSideDataStyle(newX, newY);
  } else {
    const clampedX =
      Math.floor((x - calendarRect.left) / columnWidth) * columnWidth -
      dragContainerCoord.x +
      calendarRect.left;

    const relativeY =
      Math.floor(
        (y -
          calendarRect.top -
          ((duration * ratioTimeStepCellHeight - 1) / 2) * timeStep) /
          timeStep,
      ) *
        timeStep -
      dragContainerCoord.y +
      calendarRect.top;

    const clampedY = Math.min(
      Math.max(calendarRect.top - dragContainerCoord.y, relativeY),
      calendarRect.top +
        calendarRect.height -
        dragContainerCoord.y -
        cellHeight * duration,
    );

    lastTimeIndex = Math.min(
      Math.max(
        0,
        Math.floor(
          (y -
            calendarRect.top -
            ((duration * ratioTimeStepCellHeight - 1) / 2) * timeStep) /
            timeStep,
        ) / ratioTimeStepCellHeight,
      ),
      24 - duration,
    );

    style = onDragOverCalendarStyle(
      clampedX,
      clampedY + 2,
      columnWidth,
      cellHeight * duration,
    );
  }
  return style;
};

export const getDraggableAccommodationSideDataStyle = (
  x: number,
  y: number,
  deltaMousePosition: { x: number; y: number },
  dragContainerCoord: { x: number; y: number },
  _duration: number,
) => {
  let style: CSSProperties;

  if (!isInsidePlanning(x, y) && !isInsideAccommodationDZ(x, y)) {
    const newX = x - deltaMousePosition.x - dragContainerCoord.x;
    const newY = y - deltaMousePosition.y - dragContainerCoord.y;
    style = onDragOverSideDataStyle(newX, newY);
  } else {
    const clampedX =
      Math.floor((x - dropZoneRect.left) / columnWidth) * columnWidth -
      dragContainerCoord.x +
      dropZoneRect.left;

    const clampedY =
      dropZoneRect.top - dragContainerCoord.y - accommodationDropZoneHeight;

    style = onDragOverAccommodationDZStyle(
      clampedX,
      clampedY + 2,
      columnWidth,
      expandedAccommodationDropZoneHeight,
    );
  }
  return style;
};

export const getDraggableAccommodationCalendarStyle = (
  x: number,
  _y: number,
  _deltaMousePosition: { x: number; y: number },
  dragContainerCoord: { x: number; y: number },
  _duration: number,
) => {
  const relativeX = x - dropZoneRect.left; //Relative to calendar position
  const clampedX = Math.max(0, Math.min(dropZoneRect.width - 1, relativeX));

  const steppedX =
    Math.floor((clampedX - dragContainerCoord.x) / columnWidth) * columnWidth; //Relative to draggable container position

  const style = onDragOverAccommodationDZStyle(
    steppedX,
    0,
    columnWidth,
    "100%",
  );

  return style;
};

// final destination values
export const getFinalDestination = (
  x: number,
  y: number,
  allowSideData: boolean,
): [string, number] => {
  if (!isInsidePlanning(x, y) && allowSideData) {
    return [SIDE_DATA_COL_ID, -1];
  }
  if (x < calendarRect.x) {
    return [colIds[0], lastTimeIndex];
  } else if (x > calendarRect.x + calendarRect.width) {
    return [
      colIds[Math.floor((calendarRect.width - 1) / columnWidth)],
      lastTimeIndex,
    ];
  }
  const colIndex = Math.floor((x - calendarRect.x) / columnWidth);
  return [colIds[colIndex + colIndexOffset], lastTimeIndex];
};

export const getFinalDestinationInAccommodationDZ = (
  x: number,
  y: number,
): [string, number] => {
  if (isInsideAccommodationDZ(x, y) || isInsidePlanning(x, y)) {
    const colIndex = Math.floor((x - dropZoneRect.x) / columnWidth);
    return [colIds[colIndex + colIndexOffset], -1];
  }
  return [SIDE_DATA_COL_ID, -1];
};

// helper functions
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

const isInsideAccommodationDZ = (x: number, y: number) => {
  if (
    x > dropZoneRect.left &&
    x < dropZoneRect.left + dropZoneRect.width &&
    y > dropZoneRect.top &&
    y < dropZoneRect.top + dropZoneRect.height
  ) {
    return true;
  }
  return false;
};
