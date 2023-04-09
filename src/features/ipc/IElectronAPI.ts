import IActivity from "../../Models/IActivity";
import ITrip from "../../Models/ITrip";
import ITrips from "../../Models/ITrip";

export interface IElectronAPI {
  //Trips
  getAllTrips: () => Promise<ITrips[]>;
  insertTrip: (trip: ITrip) => Promise<void>;
  updateTrip: (trip: ITrip) => Promise<void>;
  deleteTrip: (tripId: number) => Promise<void>;
  //Trips
  getAllActivities: (tripId: number) => Promise<IActivity[]>;
  insertActivity: (activity: IActivity) => Promise<void>;
  updateActivity: (activity: IActivity) => Promise<void>;
  deleteActivity: (tripId: number) => Promise<void>;
}
