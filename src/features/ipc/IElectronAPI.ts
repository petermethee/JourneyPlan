import { EArtifactTableName } from "../../Models/EArtifacts";
import IAttachment from "../../Models/IAttachment";
import { IArtifact } from "../../Models/IArtifact";
import IPlanningArtifact, { IPlanning } from "../../Models/IPlanningArtifact";
import ITrip from "../../Models/ITrip";
import ITrips from "../../Models/ITrip";

export interface IElectronAPI {
  //Trips
  getAllTrips: () => Promise<ITrips[]>;
  insertTrip: (trip: ITrip) => Promise<void>;
  updateTrip: (trip: ITrip) => Promise<void>;
  deleteTrip: (tripId: number) => Promise<void>;
  //global
  getAllItems: (
    tableName: EArtifactTableName,
    tripId: number
  ) => Promise<IArtifact[]>;
  insertItem: (
    tableName: EArtifactTableName,
    item: IArtifact
  ) => Promise<{ id: number; newAttachments: IAttachment[] }>;
  updateItem: (
    tableName: EArtifactTableName,
    item: IArtifact
  ) => Promise<IAttachment[]>;
  deleteItem: (tableName: EArtifactTableName, itemId: number) => Promise<void>;

  //Planning
  getAllPlannings: (tripId: number) => Promise<IPlanning[]>;
  insertPlanning: (planning: IPlanning) => Promise<number>;
  updatePlanning: (planning: IPlanning) => Promise<void>;
  deletePlanning: (planningId: number) => Promise<void>;

  //Planning Artifacts
  getAllArtifactsPlanning: (planningId: number) => Promise<IPlanningArtifact[]>;
  insertArtifactPlanning: (
    planningArtifact: IPlanningArtifact
  ) => Promise<number>;
  updateArtifactPlanning: (
    planningArtifact: IPlanningArtifact
  ) => Promise<void>;
  deleteArtifactPlanning: (planningArtifactId: number) => Promise<void>;
}
