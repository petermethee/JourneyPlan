import { PlanningArtifactTable, PlanningsTable } from "./DataBaseModel";
import { EArtifact } from "./EArtifacts";

export default interface IPlanningArtifact {
  [PlanningArtifactTable.id]: number;
  [PlanningArtifactTable.id_planning]: number;
  artifactId: number;
  [PlanningArtifactTable.date]: string;
  [PlanningArtifactTable.timeIndex]: number;
  artifactType: EArtifact;
}

export interface IDBPlanningArtifact {
  [PlanningArtifactTable.id]: number;
  [PlanningArtifactTable.date]: string;
  [PlanningArtifactTable.timeIndex]: number;
  [PlanningArtifactTable.id_accomodation]: number | null;
  [PlanningArtifactTable.id_activity]: number | null;
  [PlanningArtifactTable.id_transport]: number | null;
  [PlanningArtifactTable.id_planning]: number;
}

export interface IPlanning {
  [PlanningsTable.id]: number;
  [PlanningsTable.id_trip]: number;
  [PlanningsTable.name]: string;
}
