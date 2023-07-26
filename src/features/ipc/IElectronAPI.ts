import { EArtifactTableName } from "../../Models/EArtifacts";
import IAttachment from "../../Models/IAttachment";
import { IItem } from "../../Models/IItem";
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
  ) => Promise<IItem[]>;
  insertItem: (
    tableName: EArtifactTableName,
    item: IItem
  ) => Promise<{ id: number; newAttachments: IAttachment[] }>;
  updateItem: (
    tableName: EArtifactTableName,
    item: IItem
  ) => Promise<IAttachment[]>;
  deleteItem: (tableName: EArtifactTableName, itemId: number) => Promise<void>;

  //Planning
  getAllPlannings: (tripId: number) => Promise<IPlanning[]>;
  insertPlanning: (planning: IPlanning) => Promise<number>;
  updatePlanning: (planning: IPlanning) => Promise<void>;
  deletePlanning: (tripId: number) => Promise<void>;
}
