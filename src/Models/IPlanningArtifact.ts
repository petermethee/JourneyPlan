import { PlanningArtifactTable, PlanningsTable } from "./DataBaseModel";
import { EArtifact } from "./EArtifacts";

export default interface IPlanningArtifact {
  [PlanningArtifactTable.id]: string;
  artifactId: number;
  // [PlanningArtifactTable.id_planning]: number;
  [PlanningArtifactTable.date]: string;
  [PlanningArtifactTable.timeIndex]: number;
  artifactType: EArtifact;
}

export interface IDBPlanningArtifact {
  [PlanningArtifactTable.id]: string;
  [PlanningArtifactTable.date]: string;
  [PlanningArtifactTable.timeIndex]: number;
  [PlanningArtifactTable.id_accomodation]: number;
  [PlanningArtifactTable.id_activity]: number;
  [PlanningArtifactTable.id_transport]: number;
  [PlanningArtifactTable.id_planning]: number;
}

export interface IPlanning {
  [PlanningsTable.id]: number;
  [PlanningsTable.id_trip]: number;
  [PlanningsTable.name]: string;
}
