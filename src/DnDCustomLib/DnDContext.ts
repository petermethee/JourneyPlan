import { createContext } from "react";

export type TDnDEvent = {
  id: number;
  source: string;
  destination: { dayIndex: number; timeIndex: number };
};
export const DragNDropContext = createContext({
  onDragEnd: (event: TDnDEvent) => {},
});
