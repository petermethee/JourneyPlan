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
  getAllItems: (tableName: string, tripId: number) => Promise<IItem[]>;
  insertItem: (tableName: string, item: IItem) => Promise<void>;
  updateItem: (tableName: string, item: IItem) => Promise<void>;
  deleteItem: (tableName: string, itemId: number) => Promise<void>;
}
