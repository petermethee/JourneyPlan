import { EArtifactTableName } from "../../Models/EArtifacts";
import { IItem } from "../../Models/IItem";
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
  insertItem: (tableName: EArtifactTableName, item: IItem) => Promise<number>;
  updateItem: (tableName: EArtifactTableName, item: IItem) => Promise<void>;
  deleteItem: (tableName: EArtifactTableName, itemId: number) => Promise<void>;
}
