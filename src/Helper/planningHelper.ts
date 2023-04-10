let columnWidth = 100;
let cellHeight = 50;
let hourLabelWidth = 0;
let sideDataWidth = 200;
let colNumber = 1;

export const initPlanningDimensions = (
  initColWidth: number,
  initColNumber: number
) => {
  columnWidth = initColWidth;
  colNumber = initColNumber;
};

export const getColWidth = () => columnWidth;
export const getCellHeight = () => cellHeight;
export const getCollisionPosition = (
  x: number,
  y: number,
  deltaMousePosition: { x: number; y: number }
) => {
  const offset = hourLabelWidth + sideDataWidth;
  if (x < offset) {
    return [x - deltaMousePosition.x, y - deltaMousePosition.y];
  } else {
    const clampedX =
      Math.round((x - offset) / columnWidth) * columnWidth + offset;

    const clampedY = Math.round(y / cellHeight) * cellHeight;
    return [clampedX, clampedY];
  }
};

export const setSideDataWidth = (width: number) => {
  sideDataWidth = width;
};
