import { PlanningArtifactTable } from "./DataBaseModel";
import { EArtifact } from "./EArtifacts";

export default interface IPlanningArtifact {
  [PlanningArtifactTable.id]: string;
  artifactId: number;
  [PlanningArtifactTable.date]: string;
  [PlanningArtifactTable.timeIndex]: number;
  artifactType: EArtifact;
}
