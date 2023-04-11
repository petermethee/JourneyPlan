import { PlanningActivityTable } from "./DataBaseModel";

export default interface IPlanningAvtivity {
  [PlanningActivityTable.id]: string;
  [PlanningActivityTable.activityId]: number;
  [PlanningActivityTable.date]: string;
  [PlanningActivityTable.timeIndex]: number;
}
