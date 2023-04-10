import { PlanningActivityTable } from "./DataBaseModel";

export default interface IPlanningAvtivity {
  [PlanningActivityTable.id]: string;
  [PlanningActivityTable.activity]: number;
  [PlanningActivityTable.date]: string;
  [PlanningActivityTable.hour]: number;
}
