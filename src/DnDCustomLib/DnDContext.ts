import { createContext } from "react";

export type TDroppableInfo = { colId: string; timeIndex: number };
export type TDnDEvent = {
  darggableId: number;
  source: TDroppableInfo;
  destination: TDroppableInfo;
};
export const DragNDropContext = createContext({
  onDragEnd: (event: TDnDEvent) => {},
});
